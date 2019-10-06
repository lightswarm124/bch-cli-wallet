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
    address: "bchtest:qrls6vzjkkxlds7aqv9075u0fttwc7u9jvczn5fdt9",
    balance: "8954",
    totalReceived: "8954",
    totalSent: "0",
    unconfirmedBalance: "0",
    unconfirmedTxs: 0,
    txs: 1,
    txids: ["sometxid"]
  },
  {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    address: "bchtest:qzayl9rxxprzst3fnydykx2rt4d746fcqq8mh040hp",
    balance: "0",
    totalReceived: "0",
    totalSent: "0",
    unconfirmedBalance: "0",
    unconfirmedTxs: 0,
    txs: 0
  }
]

// Has no addresses with a balance.
const mockAddressDetails2 = [
  {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    address: "bchtest:qrls6vzjkkxlds7aqv9075u0fttwc7u9jvczn5fdt9",
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
    address: "bchtest:qzayl9rxxprzst3fnydykx2rt4d746fcqq8mh040hp",
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

const mockTokenUtxo = {
  utxos: [
    {
      txid: "4588c219dd5842ddce3962d1dfe443b92337fa91d5314ee7792b9cd8dac32075",
      vout: 1,
      amount: 0.00000546,
      satoshis: 546,
      height: 597740,
      confirmations: 604
    }
  ],
  legacyAddress: "16qFZvK3t7hiXxPJh1wMHnmugzQHAVQgB3",
  cashAddress: "bitcoincash:qqll3st8xl0k8cgv8dgrrrkntv6hqdn8huv3xm2ztf",
  scriptPubKey: "76a9143ff8c16737df63e10c3b50318ed35b35703667bf88ac"
}

const mockTokenUtxoDetails = [
  {
    txid: "4588c219dd5842ddce3962d1dfe443b92337fa91d5314ee7792b9cd8dac32075",
    vout: 1,
    amount: 0.00000546,
    satoshis: 546,
    height: 597740,
    confirmations: 604,
    utxoType: "token",
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

module.exports = {
  mockAddressDetails1,
  mockAddressDetails2,
  hasBalanceMock,
  mockTokenUtxo,
  mockTokenUtxoDetails,
  mockBalancesForAddress
}
