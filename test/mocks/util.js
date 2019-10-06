/*
  Contains mock data for the util.js library.
*/

"use strict"

const mockUtxo = [
  {
    txid: "2cb218dc02e5df66506950174bfa540497973cba141f1ff737d3be042069c935",
    vout: 0,
    value: "1000",
    height: 1332533,
    confirmations: 32,
    satoshis: 1000,
    hdIndex: 1
  }
]

const mockWallet = {
  network: "testnet",
  mnemonic:
    "alert mad wreck salon target later across crater stick mammal grunt ability",
  derivation: 245,
  rootAddress: "bchtest:qzl37uzel5urphw8dnkerxtlr5mxunvsys062p7g9v",
  balance: 0.00001,
  nextAddress: 3,
  hasBalance: [
    {
      index: 1,
      balance: 0.00001,
      balanceSat: 1000,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      cashAddress: "bchtest:qzylf04c9f9d20gndgw9dp82602umwzuuqhnxv7jmn"
    }
  ],
  name: "temp",
  balanceConfirmed: 0.00001,
  balanceUnconfirmed: 0,
  SLPUtxos: []
}

module.exports = {
  mockUtxo,
  mockWallet
}
