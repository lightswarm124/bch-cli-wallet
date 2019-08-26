/*
  oclif command to send SLP tokens to an address.

  This command is optimized for privacy the same way the 'send' command is. See
  that command for details.

  Spends all token UTXOs for the same token and will send token change to the
  same address the BCH change.

  Basic workflow of sending an SLP token:
  - Inputs:
    - token Id, amount, input token UTXOs, input BCH payment UTXO, token output addr, token change addr, bch change addr
    - Note: All UTXOs for the same token should be spent. This will consolidate token UTXOs.
  - Validate inputs
  - Convert token quantities into their base denomination (satoshis) with BigNumber lib.
  - Generate the OP_RETURN transaction
*/

"use strict"

const GetAddress = require("./get-address")
const UpdateBalances = require("./update-balances")
const config = require("../../config")

const AppUtils = require("../util")
const appUtils = new AppUtils()

const BigNumber = require("bignumber.js")

// Mainnet by default
const BITBOX = new config.BCHLIB({ restURL: config.MAINNET_REST })

// Used for debugging and error reporting.
const util = require("util")
util.inspect.defaultOptions = { depth: 2 }

const { Command, flags } = require("@oclif/command")

class SendTokens extends Command {
  constructor(argv, config) {
    super(argv, config)
    //_this = this

    this.BITBOX = BITBOX
  }

  async run() {
    try {
      const { flags } = this.parse(SendTokens)

      // Ensure flags meet qualifiying critieria.
      this.validateFlags(flags)

      const name = flags.name // Name of the wallet.
      const qty = flags.qty // Amount to send in BCH.
      const sendToAddr = flags.sendAddr // The address to send to.
      const tokenId = flags.tokenId // SLP token ID.

      // Open the wallet data file.
      const filename = `${__dirname}/../../wallets/${name}.json`
      let walletInfo = appUtils.openWallet(filename)
      walletInfo.name = name

      console.log(`Existing balance: ${walletInfo.balance} BCH`)

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (walletInfo.network === "testnet") {
        this.BITBOX = new config.BCHLIB({ restURL: config.TESTNET_REST })
        appUtils.BITBOX = this.BITBOX
      }

      // Update balances before sending.
      const updateBalances = new UpdateBalances()
      updateBalances.BITBOX = this.BITBOX
      walletInfo = await updateBalances.updateBalances(filename, walletInfo)
      console.log(`walletInfo: ${JSON.stringify(walletInfo, null, 2)}`)

      // Get a list of token UTXOs for this token.
      const tokenUtxos = walletInfo.SLPUtxos.filter(x => x.tokenId === tokenId)
      if (tokenUtxos.length === 0) {
        this.log(`No tokens in the wallet matched the given token ID.`)
        return
      }
      console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`)

      // Get info on UTXOs controlled by this wallet.
      const utxos = await appUtils.getUTXOs(walletInfo)
      if (utxos.length === 0) {
        this.log(
          `No BCH UTXOs found in wallet. No way to pay miner fees for transaction.`
        )
        return
      }
      //console.log(`send utxos: ${util.inspect(utxos)}`)

      // Select optimal UTXO
      // TODO: Figure out the appropriate amount of BCH to use in selectUTXO()
      const utxo = await this.selectUTXO(0.000005, utxos)
      console.log(`selected utxo: ${util.inspect(utxo)}`)

      // Exit if there is no UTXO big enough to fulfill the transaction.
      if (!utxo.amount) {
        this.log(
          `Could not find a UTXO big enough for this transaction. More BCH needed.`
        )
        return
      }

      // Generate a new address, for sending change to.
      const getAddress = new GetAddress()
      getAddress.BITBOX = this.BITBOX
      const changeAddress = await getAddress.getAddress(filename)
      console.log(`changeAddress: ${changeAddress}`)

      // Send the token, transfer change to the new address
      const hex = await this.sendTokens(
        utxo,
        qty,
        changeAddress,
        sendToAddr,
        walletInfo,
        tokenUtxos
      )

      // const txid = await appUtils.broadcastTx(hex)
      // console.log(`TXID: ${txid}`)
    } catch (err) {
      //if (err.message) console.log(err.message)
      //else console.log(`Error in .run: `, err)
      console.log(`Error in send.js/run(): `, err)
    }
  }

  // Generates the transaction in hex format, ready to broadcast to network.
  async sendTokens(
    utxo,
    qty,
    changeAddress,
    sendToAddr,
    walletInfo,
    tokenUtxos
  ) {
    try {
      //console.log(`utxo: ${util.inspect(utxo)}`)

      // instance of transaction builder
      let transactionBuilder
      if (walletInfo.network === `testnet`)
        transactionBuilder = new this.BITBOX.TransactionBuilder("testnet")
      else transactionBuilder = new this.BITBOX.TransactionBuilder()

      //const satoshisToSend = Math.floor(bch * 100000000)
      //console.log(`Amount to send in satoshis: ${satoshisToSend}`)
      const originalAmount = utxo.satoshis
      const vout = utxo.vout
      const txid = utxo.txid

      // add input utxo to pay for transaction.
      transactionBuilder.addInput(txid, vout)

      // add each token UTXO as an input.
      for (let i = 0; i < tokenUtxos.length; i++)
        transactionBuilder.addInput(tokenUtxos[i].txid, tokenUtxos[i].vout)

      // get byte count to calculate fee. paying 1 sat
      // Note: This may not be totally accurate. Just guessing on the byteCount size.
      const byteCount = this.BITBOX.BitcoinCash.getByteCount(
        { P2PKH: 2 },
        { P2PKH: 3 }
      )
      //console.log(`byteCount: ${byteCount}`)
      const satoshisPerByte = 1.1
      const txFee = Math.floor(satoshisPerByte * byteCount)
      //console.log(`txFee: ${txFee} satoshis\n`)

      // amount to send back to the sending address. It's the original amount - 1 sat/byte for tx size
      const remainder = originalAmount - txFee
      //console.log(`remainder: ${remainder}`)

      // Debugging.
      /*
      console.log(
        `Sending original UTXO amount of ${originalAmount} satoshis from address ${changeAddress}`
      )
      console.log(
        `Sending ${satoshisToSend} satoshis to recieving address ${sendToAddr}`
      )
      console.log(
        `Sending remainder amount of ${remainder} satoshis to new address ${changeAddress}`
      )
      console.log(`Paying a transaction fee of ${txFee} satoshis`)
      */

      // Generate the OP_RETURN entry for an SLP SEND transaction.
      const { script, outputs } = this.generateOpReturn(tokenUtxos, qty)
      //console.log(`script: ${JSON.stringify(script, null, 2)}`)

      const data = BITBOX.Script.encode(script)
      //console.log(`data: ${JSON.stringify(data, null, 2)}`)

      // Add OP_RETURN as first output.
      transactionBuilder.addOutput(data, 0)

      // Send dust transaction representing tokens being sent.
      transactionBuilder.addOutput(
        this.BITBOX.Address.toLegacyAddress(sendToAddr),
        546
      )

      // Return any token change back to the sender.
      if (outputs > 1) {
        transactionBuilder.addOutput(
          this.BITBOX.Address.toLegacyAddress(changeAddress),
          546
        )
      }

      // Last output: send the change back to the wallet.
      transactionBuilder.addOutput(
        this.BITBOX.Address.toLegacyAddress(changeAddress),
        remainder
      )

      // Generate a keypair from the change address.
      const change = await appUtils.changeAddrFromMnemonic(
        walletInfo,
        utxo.hdIndex
      )
      //console.log(`change: ${JSON.stringify(change, null, 2)}`)
      const keyPair = this.BITBOX.HDNode.toKeyPair(change)

      // Sign the transaction with the private key for the UTXO paying the fees.
      let redeemScript
      transactionBuilder.sign(
        0,
        keyPair,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        originalAmount
      )

      // Sign each token UTXO being consumed.
      for (let i=0; i < tokenUtxos.length; i++) 
        const thisUtxo = tokenUtxos[i]

        // TO-DO: Update-Balance needs to add the address index of the HD node
        // in order to generate the private-key for the SLP UTXOs.

        // transactionBuilder.sign(
        //   0
        // )
      

      // build tx
      const tx = transactionBuilder.build()

      // output rawhex
      const hex = tx.toHex()
      console.log(`Transaction raw hex: `)
      console.log(hex)

      return hex
    } catch (err) {
      console.log(`Error in sendBCH()`)
      throw err
    }
  }

  // Generate the OP_RETURN script for an SLP Send transaction.
  // It's assumed all elements in the tokenUtxos array belong to the same token.
  generateOpReturn(tokenUtxos, sendQty) {
    try {
      const tokenId = tokenUtxos[0].tokenId
      const decimals = tokenUtxos[0].decimals

      // Calculate the total amount of tokens owned by the wallet.
      let totalTokens = 0
      for (let i = 0; i < tokenUtxos.length; i++)
        totalTokens += tokenUtxos[i].tokenQty

      const change = totalTokens - sendQty

      let script
      let outputs = 1

      // The normal case, when there is token change to return to sender.
      if (change > 0) {
        outputs = 2

        const baseQty = new BigNumber(sendQty).times(10 ** decimals)
        const baseChange = new BigNumber(change).times(10 ** decimals)

        script = [
          BITBOX.Script.opcodes.OP_RETURN,
          Buffer.from("534c5000", "hex"),
          BITBOX.Script.opcodes.OP_1,
          Buffer.from(`SEND`),
          Buffer.from(tokenId),
          Buffer.from(baseQty.toString()),
          Buffer.from(baseChange.toString())
        ]
      } else {
        // Corner case, when there is no token change to send back.

        const baseQty = new BigNumber(sendQty).times(10 ** decimals)

        script = [
          BITBOX.Script.opcodes.OP_RETURN,
          Buffer.from("534c5000", "hex"),
          BITBOX.Script.opcodes.OP_1,
          Buffer.from(`SEND`),
          Buffer.from(tokenId),
          Buffer.from(baseQty.toString())
        ]
      }

      return { script, outputs }
    } catch (err) {
      console.log(`Error in generateOpReturn()`)
      throw err
    }
  }

  // Selects a UTXO from an array of UTXOs based on this optimization criteria:
  // 1. The UTXO must be larger than or equal to the amount of BCH to send.
  // 2. The UTXO should be as close to the amount of BCH as possible.
  //    i.e. as small as possible
  // Returns a single UTXO object.
  selectUTXO(bch, utxos) {
    let candidateUTXO = {}

    const bchSatoshis = bch * 100000000
    const total = bchSatoshis + 250 // Add 250 satoshis to cover TX fee.

    //console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

    // Loop through all the UTXOs.
    for (var i = 0; i < utxos.length; i++) {
      const thisUTXO = utxos[i]
      // The UTXO must be greater than or equal to the send amount.
      if (thisUTXO.satoshis >= total) {
        // Automatically assign if the candidateUTXO is an empty object.
        if (!candidateUTXO.satoshis) {
          candidateUTXO = thisUTXO
          continue

          // Replace the candidate if the current UTXO is closer to the send amount.
        } else if (candidateUTXO.satoshis > thisUTXO.satoshis) {
          candidateUTXO = thisUTXO
        }
      }
    }

    return candidateUTXO
  }

  // Validate the proper flags are passed in.
  validateFlags(flags) {
    // Exit if wallet not specified.
    const name = flags.name
    if (!name || name === "")
      throw new Error(`You must specify a wallet with the -n flag.`)

    const qty = flags.qty
    if (isNaN(Number(qty)))
      throw new Error(`You must specify a quantity of tokens with the -q flag.`)

    const sendAddr = flags.sendAddr
    if (!sendAddr || sendAddr === "")
      throw new Error(`You must specify a send-to address with the -a flag.`)

    const tokenId = flags.tokenId
    if (!tokenId || tokenId === "")
      throw new Error(`You must specifcy the SLP token ID`)

    return true
  }
}

SendTokens.description = `Send SLP tokens.`

SendTokens.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" }),
  tokenId: flags.string({ char: "t", description: "Token ID" }),
  sendAddr: flags.string({
    char: "a",
    description: "Cash or SimpleLedger address to send to"
  }),
  qty: flags.string({ char: "q", decription: "Quantity of tokens to send" })
}

module.exports = SendTokens
