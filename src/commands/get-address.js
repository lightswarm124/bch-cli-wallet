/*
  Generates a new HD address for recieving BCH.

  -The next available address is tracked by the 'nextAddress' property in the
  wallet .json file.

  TODO:
*/

"use strict"

const qrcode = require("qrcode-terminal")

const AppUtils = require("../util")
const appUtils = new AppUtils()

const MAIN_REST = `https://rest.bitcoin.com/v2/`
const TEST_REST = `https://trest.bitcoin.com/v2/`

const BB = require("slp-sdk")
const BITBOX = new BB({ restURL: MAIN_REST })

// Used for debugging and iterrogating JS objects.
const util = require("util")
util.inspect.defaultOptions = { depth: 2 }

const { Command, flags } = require("@oclif/command")

//let _this

class GetAddress extends Command {
  constructor(argv, config) {
    super(argv, config)

    this.BITBOX = BITBOX
  }

  async run() {
    try {
      const { flags } = this.parse(GetAddress)

      // Validate input flags
      this.validateFlags(flags)

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (flags.testnet) this.BITBOX = new BB({ restURL: TEST_REST })

      // Generate an absolute filename from the name.
      const filename = `${__dirname}/../../wallets/${flags.name}.json`

      const newAddress = await this.getAddress(filename, flags)

      // Display the address as a QR code.
      qrcode.generate(newAddress, { small: true })

      // Display the address to the user.
      this.log(`${newAddress}`)
      //this.log(`legacy address: ${legacy}`)
    } catch (err) {
      if (err.message) console.log(err.message)
      else console.log(`Error in GetAddress.run: `, err)
    }
  }

  async getAddress(filename, flags) {
    //const filename = `${__dirname}/../../wallets/${name}.json`

    const walletInfo = appUtils.openWallet(filename)
    //console.log(`walletInfo: ${JSON.stringify(walletInfo, null, 2)}`)

    // Point to the correct rest server.
    if (walletInfo.network === "testnet")
      this.BITBOX = new BB({ restURL: TEST_REST })
    else this.BITBOX = new BB({ restURL: MAIN_REST })

    // root seed buffer
    const rootSeed = this.BITBOX.Mnemonic.toSeed(walletInfo.mnemonic)

    // master HDNode
    let masterHDNode
    if (walletInfo.network === "testnet")
      masterHDNode = this.BITBOX.HDNode.fromSeed(rootSeed, "testnet")
    else masterHDNode = this.BITBOX.HDNode.fromSeed(rootSeed)

    // HDNode of BIP44 account
    const account = this.BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")
    //console.log(`account: ${util.inspect(account)}`)

    // derive an external change address HDNode
    const change = this.BITBOX.HDNode.derivePath(
      account,
      `0/${walletInfo.nextAddress}`
    )
    //console.log(`change: ${util.inspect(change)}`)

    // Increment to point to a new address for next time.
    walletInfo.nextAddress++

    // Update the wallet file.
    await appUtils.saveWallet(filename, walletInfo)

    // get the cash address
    let newAddress = this.BITBOX.HDNode.toCashAddress(change)
    //let newAddress = BITBOX.HDNode.toLegacyAddress(change)
    //console.log(`newAddress: ${JSON.stringify(newAddress, null, 2)}`)

    // Convert to a simpleledger: address if token flag is passed.
    if (flags && flags.token)
      newAddress = this.BITBOX.Address.toSLPAddress(newAddress)

    return newAddress
  }

  // Validate the proper flags are passed in.
  validateFlags(flags) {
    // Exit if wallet not specified.
    const name = flags.name
    if (!name || name === "")
      throw new Error(`You must specify a wallet with the -n flag.`)

    return true
  }
}

GetAddress.description = `Generate a new address to recieve BCH.`

GetAddress.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" }),
  token: flags.boolean({
    char: "t",
    description: "Generate a simpledger: token address"
  })
}

module.exports = GetAddress
