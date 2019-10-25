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
const Send = require("./send")
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

class GenesisTokens extends Command {
  constructor(argv, config) {
    super(argv, config)
    //_this = this

    this.BITBOX = BITBOX
    this.appUtils = appUtils // Allows for easy mocking for unit tests.
  }

  async run() {
    try {
      const { flags } = this.parse(GenesisTokens)

      // Ensure flags meet qualifiying critieria.
      this.validateFlags(flags)

      const name = flags.name // Name of the wallet.
/*      const decimals = flags.decimals // Number of decimals.
      const documentURL = flags.documentURL // Document URL link.
      const genesisAddr = flags.genesisAddr // The address to send to.
      const batonAddr = flags.batonAddr // The address to mint more tokens.
      const qty = flags.qty // Amount to send in BCH.
      const ticker = flags.ticker // Token ticker name
      const tokenName = flags.tokenName // Token name
*/
      // Open the wallet data file.
      const filename = `${__dirname}/../../wallets/${name}.json`
      let walletInfo = appUtils.openWallet(filename)
      walletInfo.name = name

//      console.log(`Existing balance: ${walletInfo.balance} BCH`)

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (walletInfo.network === "testnet") {
        this.BITBOX = new config.BCHLIB({ restURL: config.TESTNET_REST })
        appUtils.BITBOX = this.BITBOX
      }
      // Update balances before sending.
      const updateBalances = new UpdateBalances()
      updateBalances.BITBOX = this.BITBOX
      walletInfo = await updateBalances.updateBalances(flags)
//      console.log(`walletInfo: ${JSON.stringify(walletInfo, null, 2)}`)

      // Get a list of BCH UTXOs in this wallet that can be used to pay for
      // the transaction fee.
      const utxos = await this.getBchUtxos(walletInfo)
//      console.log(`send utxos: ${util.inspect(utxos)}`)

      // Select optimal UTXO
      // TODO: Figure out the appropriate amount of BCH to use in selectUTXO()
      const send = new Send()
      if (walletInfo.network === "testnet") {
        send.BITBOX = new config.BCHLIB({ restURL: config.TESTNET_REST })
        send.appUtils.BITBOX = new config.BCHLIB({
          restURL: config.TESTNET_REST
        })
      }
      const utxo = await send.selectUTXO(0.000015, utxos)
      // 1500 satoshis used until a more accurate calculation can be devised.
      //console.log(`selected utxo: ${util.inspect(utxo)}`)

      // Exit if there is no UTXO big enough to fulfill the transaction.
      if (!utxo.amount) {
        this.log(
          `Could not find a UTXO big enough for this transaction. More BCH needed.`
        )
        return
      }
      this.log(utxo.amount)

      // Generate a new address, for sending change to.
      const getAddress = new GetAddress()
      getAddress.BITBOX = this.BITBOX
      const changeAddress = await getAddress.getAddress(filename)
      console.log(`changeAddress: ${changeAddress}`)


      // Create the token, transfer change to the new address
/*      const hex = await this.genesisTokens(
        utxo,
        qty,
        changeAddress,
        genesisAddr,
        walletInfo,
      )
      const txid = await appUtils.broadcastTx(hex)
      appUtils.displayTxid(txid, walletInfo.network)
*/
    } catch (err) {
      //if (err.message) console.log(err.message)
      //else console.log(`Error in .run: `, err)
      console.log(`Error in send.js/run(): `, err)
    }
  }

  // Generates the SLP transaction in hex format, ready to broadcast to network.
  async genesisTokens(
    utxo,
    qty,
    changeAddress,
    genesisAddr,
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

      // get byte count to calculate fee. paying 1 sat
      // Note: This may not be totally accurate. Just guessing on the byteCount size.
      // const byteCount = this.BITBOX.BitcoinCash.getByteCount(
      //   { P2PKH: 3 },
      //   { P2PKH: 5 }
      // )
      // //console.log(`byteCount: ${byteCount}`)
      // const satoshisPerByte = 1.1
      // const txFee = Math.floor(satoshisPerByte * byteCount)
      // console.log(`txFee: ${txFee} satoshis\n`)
      const txFee = 500

      // amount to send back to the sending address. It's the original amount - 1 sat/byte for tx size
      const remainder = originalAmount - txFee - 546 * 2
      if (remainder < 1)
        throw new Error(`Selected UTXO does not have enough satoshis`)
      //console.log(`remainder: ${remainder}`)

      // Generate the OP_RETURN entry for an SLP GENESIS transaction.
      //console.log(`Generating op-return.`)
      const { script, outputs } = this.generateOpReturn(tokenUtxos, qty)
      //console.log(`script: ${JSON.stringify(script, null, 2)}`)

      const data = BITBOX.Script.encode(script)
      //console.log(`data: ${JSON.stringify(data, null, 2)}`)

      // Add OP_RETURN as first output.
      transactionBuilder.addOutput(data, 0)

      // Send dust transaction representing tokens being sent.
      transactionBuilder.addOutput(
        this.BITBOX.Address.toLegacyAddress(genesisAddr),
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
      for (let i = 0; i < tokenUtxos.length; i++) {
        const thisUtxo = tokenUtxos[i]

        // Generate a keypair to sign the SLP UTXO.
        const slpChangeAddr = await appUtils.changeAddrFromMnemonic(
          walletInfo,
          thisUtxo.hdIndex
        )

        const slpKeyPair = this.BITBOX.HDNode.toKeyPair(slpChangeAddr)
        //console.log(`slpKeyPair: ${JSON.stringify(slpKeyPair, null, 2)}`)

        transactionBuilder.sign(
          1 + i,
          slpKeyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          thisUtxo.satoshis
        )
      }

      // build tx
      const tx = transactionBuilder.build()

      // output rawhex
      const hex = tx.toHex()
      //console.log(`Transaction raw hex: `)
      //console.log(hex)

      return hex
    } catch (err) {
      console.log(`Error in genesisTokens()`)
      throw err
    }
  }

  // A wrapper for the util library getUTXOs() call. Throws an error if there
  // are no BCH UTXOs to pay for the SLP transaction miner fees.
  async getBchUtxos(walletInfo) {
    try {
      const utxos = await this.appUtils.getUTXOs(walletInfo)
      if (utxos.length === 0) {
        throw new Error(
          `No BCH UTXOs found in wallet. No way to pay miner fees for transaction.`
        )
      }

      return utxos
    } catch (err) {
      this.log(`Error in send-tokens.js/getBchUtxos().`)
      throw err
    }
  }

  // Generate the OP_RETURN script for an SLP Send transaction.
  // It's assumed all elements in the tokenUtxos array belong to the same token.
  generateOpReturn(decimals, documentURL, genesisAddr, batonAddr, createQty, ticker, tokenName) {
    try {
      return { script, outputs }
    } catch (err) {
      console.log(`Error in generateOpReturn()`)
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags(flags) {
    //console.log(`flags: ${JSON.stringify(flags, null, 2)}`)

    // Exit if wallet not specified.
    const name = flags.name
    if (!name || name === "")
      throw new Error(`You must specify a wallet with the -n flag.`)
/*
    const decimals = flags.decimals
    if (!decimals || !Number.isInteger(decimals) || decimals < 0 || decimals > 9)
      throw new Error(`You must specify a decimal integer between 0 to 9 with the -d flag.`)

    const documentURL = flags.documentURL
    if (documentURL && typeof documentURL !== "string")
      throw new Error(`You must specify a documentURL string with the -u flag.`)

      const genesisAddr = flags.genesisAddr
      if (!genesisAddr || genesisAddr === "")
        throw new Error(`You must specify a genesis address with the -a flag.`)

    const qty = flags.qty
    if (isNaN(Number(qty)))
      throw new Error(`You must specify a quantity of tokens with the -q flag.`)

    const ticker = flags.ticker
    if (ticker && typeof ticker !== "string")
      throw new Error(`You must specify a ticker string with the -k flag.`)

    const tokenName = flags.tokenName
    if (tokenName && typeof tokenName !== "string")
      throw new Error(`You must specify a token name string with the -t flag`)
*/
    return true
  }
}

GenesisTokens.description = `Create SLP tokens.`

GenesisTokens.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" }),
/*  decimals: flags.string({ char: "d", description: "Number of decimals"}),
  documentURL: flags.string({ char: "u", description: "Token URL"}),
  genesisAddr: flags.string({ char: "a", description: "Cash or SimpleLedger address to create tokens to"
  }),
  batonAddr: flags.string,
  qty: flags.string({ char: "q", decription: "Quantity of tokens to create" }),
  ticker: flags.string({ char: "k", description: "Abbreviation of token name"}),
  tokenName: flags.string({ char: "t", description: "Name of token"})
*/
}

module.exports = GenesisTokens
