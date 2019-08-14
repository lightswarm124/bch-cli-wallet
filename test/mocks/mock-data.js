/*
  Contains mock data used in unit tests for the update-balances.js command.
*/

"use strict"

// Has an address with a balance.
const mockAddressDetails1 = [
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0,
    totalReceivedSat: 0,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 0,
    transactions: [],
    legacyAddress: "mv9wPCHx2iCdbXBkJ1UTAZCAq57PCL2YQ9",
    cashAddress: "bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt",
    currentPage: 0,
    pagesTotal: 0
  },
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0.1,
    totalReceivedSat: 10000000,
    totalSent: 0.1,
    totalSentSat: 10000000,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 2,
    transactions: [],
    legacyAddress: "n3A9BmjrEG3ubJeoAJGwjkymhmqZhGbZR2",
    cashAddress: "bchtest:qrkkx8au5lxsu2hka2c4ecn3juxjpcuz05wh08hhl2",
    currentPage: 0,
    pagesTotal: 1
  }
]

// Has no addresses with balances.
const mockAddressDetails2 = [
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0,
    totalReceivedSat: 0,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 0,
    transactions: [],
    legacyAddress: "mv9wPCHx2iCdbXBkJ1UTAZCAq57PCL2YQ9",
    cashAddress: "bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt",
    currentPage: 0,
    pagesTotal: 0
  },
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0,
    totalReceivedSat: 0,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 0,
    transactions: [],
    legacyAddress: "n3A9BmjrEG3ubJeoAJGwjkymhmqZhGbZR2",
    cashAddress: "bchtest:qrkkx8au5lxsu2hka2c4ecn3juxjpcuz05wh08hhl2",
    currentPage: 0,
    pagesTotal: 1
  }
]

const mockUtxos = {
  utxos: [
    {
      txid: "77aff2eee866ae8fb335d670e68422dddd018fbf501b0da986e52c960cb3b6d6",
      vout: 0,
      amount: 0.00005176,
      satoshis: 5176,
      height: 595653,
      confirmations: 143
    }
  ],
  legacyAddress: "14RnUWKF6dtRBnPApFAEftwTR4q4yrhtgM",
  cashAddress: "bitcoincash:qqjes5sxwneywmnzqndvs6p3l9rp55a2ug0e6e6s0a",
  slpAddress: "simpleledger:qqjes5sxwneywmnzqndvs6p3l9rp55a2ugrz3z0s3r",
  scriptPubKey: "76a9142598520674f2476e6204dac86831f9461a53aae288ac"
}

const updateBalancesMocks = {
  mockAddressDetails1,
  mockAddressDetails2,
  mockUtxos
}

module.exports = updateBalancesMocks
