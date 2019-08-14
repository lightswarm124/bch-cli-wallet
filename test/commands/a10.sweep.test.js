/*
  TODO:
*/

"use strict"

const assert = require("chai").assert
const sinon = require("sinon")

// Library under test.
const Sweep = require("../../src/commands/sweep")

// Mocking data
const { bitboxMock } = require("../mocks/bitbox")
const testwallet = require("../mocks/testwallet.json")
const updateBalancesMocks = require("../mocks/update-balances")

// BITBOX used in integration tests.
const BB = require("bitbox-sdk").BITBOX
const REST_URL = { restURL: "https://trest.bitcoin.com/v2/" }

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
      sweep.BITBOX = new BB(REST_URL)

      const flags = {
        wif: "L287yGQj4DB4fbUKSV7DMHsyGQs1qh2E3EYJ21P88mXNKaFvmNWk"
      }

      // Use mocked data if this is a unit test.
      if (process.env.TEST === "unit") {
        // Generate the corect kind of mock data.
        let mockData = updateBalancesMocks.mockAddressDetails1
        mockData = mockData[0]
        mockData.balance = 0.000013

        sandbox.stub(sweep.BITBOX.Address, "details").resolves(mockData)
      }

      const result = await sweep.getBalance(flags)

      assert.isAbove(result, 0)
    })
  })
})
