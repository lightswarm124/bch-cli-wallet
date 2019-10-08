/*
  TODO:
*/

"use strict"

const assert = require("chai").assert

const CreateWallet = require("../../src/commands/create-wallet")
const SignMessage = require("../../src/commands/sign-message")
const config = require("../../config")

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

describe("sign-message", () => {
  let BITBOX
  let signMessage

  beforeEach(() => {
    signMessage = new SignMessage()

    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
    signMessage.BITBOX = BITBOX
  })

  // signMessage can be called directly by other programs, so this is tested separately.
  it("signMessage should throw error if name is not supplied.", async () => {
    try {
      await signMessage.sign(undefined)
    } catch (err) {
      assert.include(err.message, `Could not open`, "Expected error message.")
    }
  })

  // This validation function is called when the program is executed from the command line.
  describe("#validateFlags", () => {
    it("should throw error if name is not supplied.", () => {
      try {
        signMessage.validateFlags({})
      } catch (err) {
        assert.include(
          err.message,
          `You must specify a wallet with the -n flag`,
          "Expected error message."
        )
      }
    })

    it("should throw error if index of address is not supplied.", () => {
      try {
        const flags = {
          name: `testwallet`
        }

        signMessage.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          `You must specify an index of address with the -i flag.`,
          "Expected error message."
        )
      }
    })

    it("should throw error if recieving address is not supplied.", () => {
      try {
        const flags = {
          name: `testwallet`,
          sendAddrIndex: 1
        }

        signMessage.validateFlags(flags)
      } catch (err) {
        assert.include(
          err.message,
          `You must specify a send-to address with the -s flag.`,
          "Expected error message."
        )
      }
    })

    it("should return true if all flags are supplied.", () => {
      const flags = {
        name: `testwallet`,
        sendAddrIndex: 1,
        signTheMessage: `abcd`
      }

      const result = signMessage.validateFlags(flags)

      assert.equal(result, true)
    })
  })

  it("should throw error if wallet file, index of address and message not found.", async () => {
    try {
      await signMessage.sign(`doesnotexist`)
    } catch (err) {
      assert.include(err.message, `Could not open`, "Expected error message.")
    }
  })
 
 
 
})
