/*
  TODO:


*/

"use strict"

const assert = require("chai").assert
const sinon = require("sinon")

// Library under test.
const SendTokens = require("../../src/commands/send-tokens")
const config = require("../../config")

// Mock data
const testwallet = require("../mocks/testwallet.json")
const { bitboxMock } = require("../mocks/bitbox")

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Set default environment variables for unit tests.
if (!process.env.TEST) process.env.TEST = "unit"

describe("#send-tokens", () => {
  let BITBOX
  let mockedWallet
  let sendTokens
  let sandbox

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
    mockedWallet = Object.assign({}, testwallet) // Clone the testwallet

    sandbox = sinon.createSandbox()

    sendTokens = new SendTokens()
    sendTokens.BITBOX = BITBOX
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe("#validateFlags", () => {
    it("should throw error if name is not supplied.", () => {
      try {
        sendTokens.validateFlags({})
      } catch (err) {
        assert.include(
          err.message,
          `You must specify a wallet with the -n flag`,
          "Expected error message."
        )
      }
    })

    it("should throw error if token quantity is not supplied.", () => {
      try {
        const flags = {
          name: `testwallet`
        }

        sendTokens.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          `You must specify a quantity of tokens with the -q flag`,
          "Expected error message."
        )
      }
    })

    it("should throw error if recieving address is not supplied.", () => {
      try {
        const flags = {
          name: `testwallet`,
          qty: 0.1
        }

        sendTokens.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          `You must specify a send-to address with the -a flag.`,
          "Expected error message."
        )
      }
    })

    it("should throw error if token ID is not supplied.", () => {
      try {
        const flags = {
          name: `testwallet`,
          qty: 0.1,
          sendAddr: "abc"
        }

        sendTokens.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          `You must specifcy the SLP token ID`,
          "Expected error message."
        )
      }
    })

    it("should throw error if token ID is not valid.", () => {
      try {
        const flags = {
          name: `testwallet`,
          qty: 0.1,
          sendAddr: "abc",
          tokenId: "abc"
        }

        sendTokens.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          `TokenIdHex must be provided as a 64 character hex string`,
          "Expected error message."
        )
      }
    })

    it("should return true if all flags are supplied.", () => {
      const flags = {
        name: `testwallet`,
        qty: 1.5,
        sendAddr: `abc`,
        tokenId: `c4b0d62156b3fa5c8f3436079b5394f7edc1bef5dc1cd2f9d0c4d46f82cca479`
      }

      const result = sendTokens.validateFlags(flags)

      assert.equal(result, true)
    })
  })

  // describe("#getTokenUtxos", () => {
  //
  // })

  /*

  describe("#sendBCH", () => {
    it("should send BCH on testnet", async () => {
      const bch = 0.000005 // BCH to send in an integration test.
      const utxo = {
        txid:
          "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
        vout: 0,
        scriptPubKey: "76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac",
        amount: 0.03,
        satoshis: 3000000,
        height: 1265272,
        confirmations: 733,
        legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
        cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
        hdIndex: 0
      }
      const sendToAddr = `bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt`

      const hex = await send.sendBCH(
        utxo,
        bch,
        utxo.cashAddress,
        sendToAddr,
        testwallet
      )

      //console.log(`hex: ${hex}`)

      assert.isString(hex)
    })

    it("should send BCH on mainnet", async () => {
      const bch = 0.000005 // BCH to send in an integration test.
      const utxo = {
        txid:
          "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
        vout: 0,
        scriptPubKey: "76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac",
        amount: 0.03,
        satoshis: 3000000,
        height: 1265272,
        confirmations: 733,
        legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
        cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
        hdIndex: 0
      }
      const sendToAddr = `bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt`

      // Switch to mainnet
      mockedWallet.network = "mainnet"

      const hex = await send.sendBCH(
        utxo,
        bch,
        utxo.changeAddress,
        sendToAddr,
        mockedWallet
      )

      assert.isString(hex)
    })
  })
  */
})
