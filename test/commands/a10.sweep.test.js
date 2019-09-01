/*
  TODO:
*/

"use strict"

const assert = require("chai").assert
const sinon = require("sinon")

// Library under test.
const Sweep = require("../../src/commands/sweep")
const config = require("../../config")

// Mocking data
const { bitboxMock } = require("../mocks/bitbox")
const testwallet = require("../mocks/testwallet.json")
const mockData = require("../mocks/mock-data")

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Set default environment variables for unit tests.
if (!process.env.TEST) process.env.TEST = "unit"

describe("Sweep", () => {
  let BITBOX
  let mockedWallet
  let sweep
  let sandbox

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
    mockedWallet = Object.assign({}, testwallet) // Clone the testwallet

    sweep = new Sweep()
    sweep.BITBOX = BITBOX

    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe("#validateFlags", () => {
    it("should throw error if wif is not supplied.", () => {
      try {
        sweep.validateFlags({})
      } catch (err) {
        assert.include(
          err.message,
          `You must specify a private key in WIF format with the -w flag`,
          "Expected error message."
        )
      }
    })

    it("should throw error if recieving address is not supplied.", () => {
      try {
        const flags = {
          wif: `abc123`
        }

        sweep.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          `You must specify a send-to address with the -a flag.`,
          "Expected error message."
        )
      }
    })

    it("should return true if address is supplied but balanceOnly is not", () => {
      const flags = {
        wif: `testwallet`,
        address: `abc`
      }

      const result = sweep.validateFlags(flags)

      assert.equal(result, true)
    })

    it("should return true if balanceOnly is supplied but address is not.", () => {
      const flags = {
        wif: `testwallet`,
        balanceOnly: true
      }

      const result = sweep.validateFlags(flags)

      assert.equal(result, true)
    })

    it("should return true if all flags are supplied", () => {
      const flags = {
        wif: `testwallet`,
        address: `abc`,
        balanceOnly: false
      }

      const result = sweep.validateFlags(flags)

      assert.equal(result, true)
    })
  })

  describe("#getBalance()", () => {
    it("should return balance", async () => {
      sweep.BITBOX = new config.BCHLIB({ restURL: config.MAINNET_REST })

      const flags = {
        wif: "L287yGQj4DB4fbUKSV7DMHsyGQs1qh2E3EYJ21P88mXNKaFvmNWk"
      }

      // Use mocked data if this is a unit test.
      if (process.env.TEST === "unit") {
        // Generate the corect kind of mock data.
        let mockDetails = mockData.mockAddressDetails1
        mockDetails = mockDetails[0]
        mockDetails.balance = 0.000013

        sandbox.stub(sweep.BITBOX.Address, "details").resolves(mockDetails)
      }

      const result = await sweep.getBalance(flags)
      //console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isAbove(result, 0)
    })
  })

  describe("#sweep", () => {
    it("should sweep funds", async () => {
      // Use the real library if this is not a unit test
      if (process.env.TEST !== "unit")
        sweep.BITBOX = new config.BCHLIB({ restURL: config.MAINNET_REST })

      const flags = {
        wif: "L287yGQj4DB4fbUKSV7DMHsyGQs1qh2E3EYJ21P88mXNKaFvmNWk",
        address: "bitcoincash:qqjes5sxwneywmnzqndvs6p3l9rp55a2ug0e6e6s0a"
      }

      const result = await sweep.sweep(flags)
      //console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isString(result[0], "Returned value should be a txid string.")
    })
  })
})
