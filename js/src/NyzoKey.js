const ccrypto = require('cardano-crypto.js')
const Module = require('cardano-crypto.js/lib.js')

function nyzoSeedToHexString(nyzoSeed) {
  return nyzoSeed.split('-').join('').slice(0, 64)
}


function NyzoKey(nyzoSeed) {
  if (nyzoSeed) {
    this.seed = Buffer.from(nyzoSeedToHexString(nyzoSeed), 'hex')
  } else {
    this.seed = null
  }
}


NyzoKey.prototype.toPubKey = function () {
  //validateBuffer(this.seed, 32)
  const privateKeyArrPtr = Module._malloc(32)
  const privateKeyArr = new Uint8Array(Module.HEAPU8.buffer, privateKeyArrPtr, 32)
  const publicKeyArrPtr = Module._malloc(32)
  const publicKeyArr = new Uint8Array(Module.HEAPU8.buffer, publicKeyArrPtr, 32)
  privateKeyArr.set(this.seed)
  Module._emscripten_to_public(privateKeyArrPtr, publicKeyArrPtr)
  Module._free(privateKeyArrPtr)
  Module._free(publicKeyArrPtr)
  // Does not match nyzo output
  return Buffer.from(publicKeyArr)
}

/*
NyzoKey.prototype.toPubKey = function () {
    if (this.pubKey === undefined) this.pubKey = ccrypto.toPublic(this.seed);
    return this.pubKey;
}*/


module.exports = {
    version: "0.0.1",
    NyzoKey
}
