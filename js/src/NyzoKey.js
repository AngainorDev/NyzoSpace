
const { sign, box, secretbox, randomBytes } = require("tweetnacl")
const createHash = require('create-hash');
const {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} = require("tweetnacl-util")

const bip39 = require('bip39');
const crypto = require("crypto");

const { NyzoFormat } = require("./NyzoFormat")
nyzoFormat = new NyzoFormat()

const DEFAULT_PASSWORD = "NYZO_ROCKS!"


function nyzoSeedToHexString(nyzoSeed) {
  return nyzoSeed.split('-').join('').slice(0, 64)
}


function NyzoKey(nyzoSeed) {
  if (nyzoSeed) {
    this.seed = Buffer.from(nyzoSeedToHexString(nyzoSeed), 'hex')
    this.keyPair = sign.keyPair.fromSeed(this.seed)
  } else {
    this.seed = null
    this.keyPair = null
  }
  this.chainCode = null
}


NyzoKey.prototype.toSeedHex = function() {
    return nyzoFormat.hexStringFromArray(this.seed)
}


NyzoKey.prototype.toSeedHexWithDashes = function() {
    return nyzoFormat.hexStringFromArrayWithDashes(this.seed)
}


NyzoKey.prototype.fromBIP39 = function (passPhrase, password='') {
    // HD Wallet from BIP39 - Uses seed and chainCode for derivation
    if (password == '') password = DEFAULT_PASSWORD
    let seed512 = bip39.mnemonicToSeedSync(passPhrase, password)
    // seed256 = createHash('sha256').update(seed512).digest()
    this.seed = seed512.slice(0, 32)
    this.chainCode = seed512.slice(32)
    this.keyPair = sign.keyPair.fromSeed(this.seed)
    return this
}


NyzoKey.prototype.fromPaperCode = function (passPhrase) {
    // Unique address from paper wallet, no chaincode
    this.seed = Buffer.from(bip39.mnemonicToEntropy(passPhrase), 'hex')
    this.keyPair = sign.keyPair.fromSeed(this.seed)
    this.chainCode = null
    return this
}


NyzoKey.prototype.toPaperCode = function () {
    // Mnemonic from seed, no chain code: unique address
    return bip39.entropyToMnemonic(this.toSeedHex())
}


NyzoKey.prototype.toPubKey = function () {
    return this.keyPair.publicKey
}


NyzoKey.prototype.toPubKeyHex = function () {
    return Buffer.from(this.keyPair.publicKey).toString('hex')
}


NyzoKey.prototype.toPubKeyHexWithDashes = function () {
    return nyzoFormat.hexStringFromArrayWithDashes(this.keyPair.publicKey, 0, 32)
}


/*
NyzoKey.prototype.toPubKey = function () {
    if (this.pubKey === undefined) this.pubKey = ccrypto.toPublic(this.seed);
    return this.pubKey;
}*/


module.exports = {
    version: "0.0.2",
    NyzoKey
}
