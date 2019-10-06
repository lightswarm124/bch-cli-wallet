/*
  Mock data for the update-balances command
*/

"use strict"

// Has an address with a balance.
const mockAddressDetails1 = [
  {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    address: "bchtest:qzl37uzel5urphw8dnkerxtlr5mxunvsys062p7g9v",
    balance: "0",
    totalReceived: "0",
    totalSent: "0",
    unconfirmedBalance: "0",
    unconfirmedTxs: 0,
    txs: 0
  },
  {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    address: "bchtest:qzylf04c9f9d20gndgw9dp82602umwzuuqhnxv7jmn",
    balance: "1000",
    totalReceived: "1000",
    totalSent: "0",
    unconfirmedBalance: "0",
    unconfirmedTxs: 0,
    txs: 1,
    txids: ["2cb218dc02e5df66506950174bfa540497973cba141f1ff737d3be042069c935"]
  }
]

// Has no addresses with a balance.
const mockAddressDetails2 = [
  {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    address: "bchtest:qzl37uzel5urphw8dnkerxtlr5mxunvsys062p7g9v",
    balance: "0",
    totalReceived: "0",
    totalSent: "0",
    unconfirmedBalance: "0",
    unconfirmedTxs: 0,
    txs: 0
  },
  {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    address: "bchtest:qzylf04c9f9d20gndgw9dp82602umwzuuqhnxv7jmn",
    balance: "0",
    totalReceived: "0",
    totalSent: "0",
    unconfirmedBalance: "0",
    unconfirmedTxs: 0,
    txs: 0
  }
]

const hasBalanceMock = [
  {
    index: 21,
    balance: 0.04997504,
    balanceSat: 4997504,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    cashAddress: "bchtest:qr2jpphytu94uf9h7ajexvj38awl8c9zdssrg7dklw"
  },
  {
    index: 23,
    balance: 0.04979784,
    balanceSat: 4979784,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    cashAddress: "bchtest:qrxcug4mv3z20lztfh2j4u9qdyqxhjanestcvg36t5"
  }
]

const mockTokenUtxo = [
  {
    txid: "c5ba34388b688459a1de02eeffb4e9b0f24eb45203ec90fe44f855686686ca3c",
    vout: 2,
    value: "546",
    height: 601149,
    confirmations: 2274,
    satoshis: 546
  },
  {
    txid: "4588c219dd5842ddce3962d1dfe443b92337fa91d5314ee7792b9cd8dac32075",
    vout: 1,
    value: "546",
    height: 597740,
    confirmations: 5683,
    satoshis: 546
  }
]

const mockTokenUtxoDetails = [
  {
    txid: "c5ba34388b688459a1de02eeffb4e9b0f24eb45203ec90fe44f855686686ca3c",
    vout: 2,
    value: "546",
    height: 601149,
    confirmations: 2274,
    satoshis: 546,
    utxoType: "token",
    transactionType: "send",
    tokenId: "ebd3043ea18b7c004395307d26bbb62b416bf858d07e2717b45194c64a186c03",
    tokenTicker: "p\u001f\u000e+",
    tokenName: "bang cash lotto ticket",
    tokenDocumentUrl: "http://bang.cash/",
    tokenDocumentHash: "",
    decimals: 0,
    tokenQty: 3
  },
  {
    txid: "4588c219dd5842ddce3962d1dfe443b92337fa91d5314ee7792b9cd8dac32075",
    vout: 1,
    value: "546",
    height: 597740,
    confirmations: 5683,
    satoshis: 546,
    utxoType: "token",
    transactionType: "send",
    tokenId: "3b3dbc418af179bfa9832255e9cc4e4bb7abacde8da62881f6eb466cbf70cc66",
    tokenTicker: "p\u001f\r\u001e",
    tokenName: "p\u001f\r\u001e",
    tokenDocumentUrl: "",
    tokenDocumentHash: "",
    decimals: 0,
    tokenQty: 61769
  }
]

const mockBalancesForAddress = [
  [
    {
      tokenId:
        "3b3dbc418af179bfa9832255e9cc4e4bb7abacde8da62881f6eb466cbf70cc66",
      balance: 61769,
      balanceString: "61769",
      slpAddress: "simpleledger:qqll3st8xl0k8cgv8dgrrrkntv6hqdn8huq2dqlz4h",
      decimalCount: 0
    }
  ]
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
  mockAddressDetails1,
  mockAddressDetails2,
  hasBalanceMock,
  mockTokenUtxo,
  mockTokenUtxoDetails,
  mockBalancesForAddress,
  mockWallet
}
