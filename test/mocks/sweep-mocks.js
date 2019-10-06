/*
  Mocks for unit tests for the sweep command
*/

"use strict"

const mockBalance1 = {
  page: 1,
  totalPages: 1,
  itemsOnPage: 1000,
  address: "bitcoincash:qqtc3vqfzz050jkvcfjvtzj392lf6wlqhun3fw66n9",
  balance: "1000",
  totalReceived: "1000",
  totalSent: "0",
  unconfirmedBalance: "0",
  unconfirmedTxs: 0,
  txs: 1,
  txids: ["406b9f2282fca16e1e3cb2bab02d50aacb26511b6b1becd95c81f24161b768a3"]
}

module.exports = {
  mockBalance1
}
