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

module.exports = {
  mockAddressDetails1,
  hasBalanceMock
}
