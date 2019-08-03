/*
  oclif command to analyize the market conditions for shifting from BCH to USDH.

  TODO:

*/

"use strict"

const AppUtils = require("../util")
const appUtils = new AppUtils()

const BB = require("bitbox-sdk").BITBOX
const BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v2/" })

// Used for debugging and error reporting.
const util = require("util")
util.inspect.defaultOptions = { depth: 2 }

const { Command, flags } = require("@oclif/command")

class TradeInfo extends Command {
  constructor(argv, config) {
    super(argv, config)

    this.BITBOX = BITBOX
  }

  async run() {
    try {
      const { flags } = this.parse(TradeInfo)

      this.validateFlags(flags)

      const name = flags.name

      // Open the wallet data file.
      const filename = `${__dirname}/../../wallets/${name}.json`
      const walletInfo = appUtils.openWallet(filename)
      walletInfo.name = name

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (walletInfo.network === "testnet")
        this.BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v2/" })

      console.log(`hello world.`)
    } catch (err) {
      if (err.message) console.log(err.message)
      else console.log(`Error in UpdateBalances.run: `, err)
    }
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

TradeInfo.description = `Analyize the market conditions for shifting from BCH to USDH.`

TradeInfo.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" })
}

module.exports = TradeInfo
