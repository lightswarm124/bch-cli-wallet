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

const tokenOnlyUtxos = [
  {
    txid: "90efd19136d40dfea0ee06d901029eee688b262efd7a3e26cbd2986a60912969",
    vout: 1,
    value: "546",
    confirmations: 0
  }
]

const tokenOnlyTokenInfo = [
  {
    txid: "90efd19136d40dfea0ee06d901029eee688b262efd7a3e26cbd2986a60912969",
    vout: 1,
    value: "546",
    confirmations: 0,
    satoshis: 546,
    utxoType: "token",
    transactionType: "send",
    tokenId: "dd84ca78db4d617221b58eabc6667af8fe2f7eadbfcc213d35be9f1b419beb8d",
    tokenTicker: "TAP",
    tokenName: "Thoughts and Prayers",
    tokenDocumentUrl: "",
    tokenDocumentHash: "",
    decimals: 0,
    tokenQty: 1
  }
]

const bchOnlyUtxos = [
  {
    txid: "53c9ee6e5ecec2787d2edfeaf0b192b45a937d5a4b1eaa715545eeb3c5c67ede",
    vout: 0,
    value: "1000",
    height: 603853,
    confirmations: 17
  }
]

const bchOnlyTokenInfo = [false]

const bothUtxos = [
  {
    txid: "b319024ef23f49ec645e7b5d92db66269553d662d0ad63fbf0db1d0a276c7974",
    vout: 1,
    value: "546",
    height: 603753,
    confirmations: 117
  },
  {
    txid: "3097f6fbd8d1013799f14e1d7cb5cb179fff573266cfc820d1442b88f2211200",
    vout: 0,
    value: "2000",
    height: 603753,
    confirmations: 117
  }
]

const bothTokenInfo = [
  {
    txid: "b319024ef23f49ec645e7b5d92db66269553d662d0ad63fbf0db1d0a276c7974",
    vout: 1,
    value: "546",
    height: 603753,
    confirmations: 117,
    satoshis: 546,
    utxoType: "token",
    transactionType: "send",
    tokenId: "dd84ca78db4d617221b58eabc6667af8fe2f7eadbfcc213d35be9f1b419beb8d",
    tokenTicker: "TAP",
    tokenName: "Thoughts and Prayers",
    tokenDocumentUrl: "",
    tokenDocumentHash: "",
    decimals: 0,
    tokenQty: 1
  },
  false
]

module.exports = {
  mockBalance1,
  tokenOnlyUtxos,
  tokenOnlyTokenInfo,
  bchOnlyUtxos,
  bchOnlyTokenInfo,
  bothUtxos,
  bothTokenInfo
}
