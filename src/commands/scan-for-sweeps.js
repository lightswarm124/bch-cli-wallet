/*
  This command expects the user to specify a json file as input that contains
  an array of public addresses to be scanned.

  The command scans the addresses to see if any of them have been 'swept'. If any
  are detected, it will send them voting tokens.
*/

"use strict"

const { Command, flags } = require("@oclif/command")

const AppUtils = require("../util")
const appUtils = new AppUtils()

const collect = require("collect.js")
const fs = require("fs")

const config = require("../../config")
const BITBOX = new config.BCHLIB({ restURL: config.MAINNET_REST })

// Promise based sleep function.
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

class ScanForSweeps extends Command {
  constructor(argv, config) {
    super(argv, config)

    this.BITBOX = BITBOX
  }

  async run() {
    const { flags } = this.parse(ScanForSweeps)

    // Ensure flags meet qualifiying critieria.
    this.validateFlags(flags)

    await this.scanForSweeps(flags)
  }

  async scanForSweeps(flags) {
    try {
      // Open the file containing the array of addresses to scan.
      const filename = `${__dirname}/../../${flags.file}`
      const addrList = appUtils.openWallet(filename)
      //console.log(`addrList: ${JSON.stringify(addrList, null, 2)}`)

      // Open the file containing saved previously swept addresses.
      let sweptAddrs = require(`${__dirname}/../../json/swept-addrs.json`)

      // Break the input array into chunks for 20 elements.
      const chunks = collect(addrList).chunk(20)
      //console.log(`chunks: ${JSON.stringify(chunks, null, 2)}`)

      // Loop through each chunk.
      for (let i = 0; i < chunks.items.length; i++) {
        console.log(`Scanning chunk ${i}...`)

        let thisChunk = chunks.items[i].items

        // Remove any addresses that match our saved list of swept addresses.
        thisChunk = thisChunk.filter(function(el) {
          return !sweptAddrs.includes(el)
        })

        // Get the details for each address.
        // Dev Note: balance is the 'confirmed' balance. 'unconfirmedBalance'
        // will be a negative value when the ticket is swept.
        const details = await this.BITBOX.Address.details(thisChunk)
        //console.log(`details: ${JSON.stringify(details, null, 2)}`)

        // Filter out just the addresses that match the criteria that indicate
        // the ticket has been swept.
        const sweptAddrsDetected = details.filter(x => {
          // Ticket has been swept and at least 1 block confirmation has occured.
          const confirmedSweep = x.balance === 0.0 && x.transactions.length > 0

          // Ticket has been swept, but has not been confirmed.
          const unconfirmedSweep = x.balanceSat + x.unconfirmedBalanceSat === 0

          return confirmedSweep || unconfirmedSweep
        })
        //console.log(`sweptAddrsDetected: ${JSON.stringify(sweptAddrsDetected, null, 2)}`)

        // Get just the address from the details.
        const newSweptAddrs = sweptAddrsDetected.map(x => x.cashAddress)
        // console.log(`newSweptAddrs: ${JSON.stringify(newSweptAddrs)}`)

        // Add any newly detected
        sweptAddrs = sweptAddrs.concat(newSweptAddrs)
        // console.log(`sweptAddrs: ${JSON.stringify(sweptAddrs, null, 2)}`)

        // Pause between loops to prevent rate limiting.
        await sleep(1000)
      }

      // Save the swept addresses to a json file.
      const saveFilename = `${__dirname}/../../json/swept-addrs.json`
      await this.saveData(saveFilename, sweptAddrs)
    } catch (err) {
      console.error(`Error in scan-for-sweeps: `, err)
    }
  }

  // Validate the proper flags are passed in.
  validateFlags(flags) {
    //console.log(`flags: ${JSON.stringify(flags, null, 2)}`)

    // Exit if wallet not specified.
    const file = flags.file
    if (!file || file === "")
      throw new Error(`You must specify a wallet with the -f flag.`)

    return true
  }

  // Save a object to a json file.
  saveData(filename, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, JSON.stringify(data, null, 2), function(err) {
        if (err) return reject(console.error(err))

        //console.log(`${name}.json written successfully.`)
        return resolve()
      })
    })
  }
}

ScanForSweeps.description = `Example command from oclif
...
Leaving it here for future reference in development.
`

ScanForSweeps.flags = {
  file: flags.string({
    char: "f",
    description: "filename of json file with addresses to scan."
  })
}

module.exports = ScanForSweeps
