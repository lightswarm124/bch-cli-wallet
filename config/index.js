/*
  This config file contains settings shared across files.

  Toolset and REST API can be selected with this file, or by setting the RESTAPI
  environment variable. By default, Bitcoin.com's infrastructure is used.

  You can run your own infrastructure. See bchjs.cash for details.
*/

"use strict"

// By default choose a local rest API.
let RESTAPI = "bitcoin.com"

// Override the RESTAPI setting if envronment variable is set.
if (process.env.RESTAPI) RESTAPI = process.env.RESTAPI

const BCHJS = require("@chris.troutner/bch-js")
const BITBOX = require("bitbox-sdk").BITBOX

const config = {}

if (RESTAPI === "bitcoin.com") {
  config.BCHLIB = BITBOX
  config.MAINNET_REST = `https://rest.bitcoin.com/v2/`
  config.TESTNET_REST = `https://trest.bitcoin.com/v2/`
  config.RESTAPI = "bitcoin.com"
}

if (RESTAPI === "local") {
  config.BCHLIB = BCHJS
  config.MAINNET_REST = `http://192.168.0.36:12400/v3/`
  config.TESTNET_REST = `http://192.168.0.38:13400/v3/`
  config.RESTAPI = "local"
}

if (RESTAPI === "decatur") {
  config.BCHLIB = BCHJS
  config.MAINNET_REST = `http://decatur.hopto.org:12400/v3/`
  config.TESTNET_REST = `http://decatur.hopto.org:13400/v3/`
  config.RESTAPI = "decatur"
}

module.exports = config
