/*
  TODO:
*/

"use strict"

const assert = require("chai").assert
const sinon = require("sinon")

// File under test.
const AppUtils = require("../../src/util")
const config = require("../../config")

// Mocking data
const { bitboxMock } = require("../mocks/bitbox")
const testwallet = require("../mocks/testwallet.json")
const utilMocks = require("../mocks/util")

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Set default environment variables for unit tests.
if (!process.env.TEST) process.env.TEST = "unit"

describe("#util.js", () => {
  let appUtils
  let sandbox

  beforeEach(() => {
    appUtils = new AppUtils()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe("#getUTXOs", () => {
    it("should get all UTXOs in wallet", async () => {
      // Unit test mocking.
      if (process.env.TEST === "unit") {
        sandbox
          .stub(appUtils.BITBOX.Blockbook, "utxo")
          .resolves(utilMocks.mockUtxo)
      }

      const utxos = await appUtils.getUTXOs(utilMocks.mockWallet)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      assert.isArray(utxos, "Expect array of utxos")
      if (utxos.length > 0) {
        assert.hasAllKeys(utxos[0], [
          "txid",
          "vout",
          "satoshis",
          "height",
          "confirmations",
          "hdIndex",
          "value"
        ])
      }
    })
  })

  describe("#openWallet", () => {
    it("should throw error if wallet file not found.", () => {
      try {
        appUtils.openWallet("doesnotexist")
      } catch (err) {
        assert.include(err.message, `Could not open`, "Expected error message.")
      }
    })
  })

  describe("#saveWallet", () => {
    it("should save a wallet without error", async () => {
      const filename = `${__dirname}/../../wallets/test123.json`

      await appUtils.saveWallet(filename, utilMocks.mockWallet)
    })
  })

  describe("#changeAddrFromMnemonic", () => {
    it("should return a change address", async () => {
      appUtils.BITBOX = new config.BCHLIB({
        restURL: config.TESTNET_REST
      })

      const result = await appUtils.changeAddrFromMnemonic(
        utilMocks.mockWallet,
        0
      )
      //console.log(`result: ${util.inspect(result)}`)
      //console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.hasAnyKeys(result, ["keyPair", "chainCode", "index"])
    })
  })
})
