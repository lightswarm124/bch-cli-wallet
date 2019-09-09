/*
  oclif command to analyize the market conditions for shifting from BCH to USDH.

  TODO:

*/

"use strict"

const AppUtils = require("../util")
const appUtils = new AppUtils()

const config = require("../../config")

// Mainnet by default.
const BITBOX = new config.BCHLIB({ restURL: config.MAINNET_REST })

const axios = require("axios")

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

      const tradeInfo = await this.fetchPair()
      console.log(`BCH price: $${tradeInfo.rate}`)
      console.log(`Minimum trade quantity: ${tradeInfo.min} BCH`)
      console.log(`Maximum trade quantity: ${tradeInfo.max} BCH`)
      console.log(" ")

      console.log(`Comparison Pricing:`)
      const bbPrice = await this.getBitcoinComPrice()
      console.log(`Bitcoin.com Price: $${bbPrice}`)

      const usdBch = await this.getCoinbasePrice()
      console.log(`Coinbase Price: $${usdBch}`)

      const avg = (Number(usdBch) + Number(bbPrice)) / 2
      console.log(`Average price: $${avg}`)
      console.log(" ")
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

  // Get the spot price of BCH from Coinbase.
  async getCoinbasePrice() {
    try {
      const body = await axios({
        url: `https://api.coinbase.com/v2/exchange-rates?currency=BCH`,
        method: "get",
        responseType: "json"
      })

      const usdBch = body.data.data.rates.USD

      return usdBch
    } catch (err) {
      console.error(`Error in trade-info.js/getCoinbasePrice()`)
      throw err
    }
  }

  // Gets the BCH price from the Bitcoin.com server.
  async getBitcoinComPrice() {
    try {
      const bbPrice = await this.BITBOX.Price.current("usd")

      const realPrice = bbPrice / 100

      return realPrice
    } catch (err) {
      console.error(`Error in trade-info.js/getBitcoinComPrice()`)
      throw err
    }
  }

  // Get trade pair info from SideShift.ai
  async fetchPair() {
    try {
      const body = await axios({
        url: `https://sideshift.ai/api/pairs/bch/usdh`,
        method: "get",
        responseType: "json"
      })

      //console.log(`body.data: ${JSON.stringify(body.data, null, 2)}`)

      return body.data
    } catch (err) {
      console.error(`Error in trade-info.js/getCoinbasePrice()`)
      throw err
    }
  }
}

TradeInfo.description = `Analyize the market conditions for shifting from BCH to USDH.`

TradeInfo.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" })
}

module.exports = TradeInfo
