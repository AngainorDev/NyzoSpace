
//const { sign, box, secretbox, randomBytes } = require('tweetnacl')
const { sign } = require('tweetnacl')
const createHash = require('create-hash')
const createHmac = require('create-hmac')
// const { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } = require("tweetnacl-util")

const bip39 = require('bip39');
// const crypto = require("crypto");

const { NyzoFormat } = require('./NyzoFormat')
nyzoFormat = new NyzoFormat()

const Int64 = require('node-int64')
const { NyzoStringPublicIdentifier } = require("nyzostrings/src/NyzoStringPublicIdentifier.js")
const { NyzoStringPrivateSeed } = require("nyzostrings/src/NyzoStringPrivateSeed.js")
const { NyzoStringSignature } = require("nyzostrings/src/NyzoStringSignature.js")
const { NyzoStringTransaction } = require("nyzostrings/src/NyzoStringTransaction.js")
const { nyzoStringEncoder } = require("nyzostrings/src/NyzoStringEncoder.js")

const DEFAULT_PASSWORD = 'NYZO_ROCKS!'

// SLIP-0010
const CURVE_KEY = 'ed25519 seed'

// ed25519 only uses hardened childs
const HARDENED_OFFSET = 0x80000000;

// Nyzo SLIP-044 Coin number
const COIN_NUMBER = 380;

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


NyzoKey.prototype.toNyzoPrivateSeed = function() {
    const stringObject = new NyzoStringPrivateSeed(this.seed)
    const string = nyzoStringEncoder.encode(stringObject)
    return string
}


NyzoKey.prototype.toNyzoPublicIdentifier = function() {
    const stringObject = new NyzoStringPublicIdentifier(this.keyPair.publicKey)
    const string = nyzoStringEncoder.encode(stringObject)
    return string
}


NyzoKey.prototype.toSeedHexWithDashes = function() {
    return nyzoFormat.hexStringFromArrayWithDashes(this.seed)
}


NyzoKey.prototype.fromBIP39 = function (passPhrase, password='') {
    // HD Wallet from BIP39 - Uses seed and chainCode for derivation
    //if (password == '') password = DEFAULT_PASSWORD // No more password by default
    const seed512 = bip39.mnemonicToSeedSync(passPhrase, password)  // This is a buffer
    const I = createHmac('sha512', Buffer.from(CURVE_KEY)).update(seed512).digest()
    this.seed = I.slice(0, 32)
    this.chainCode = I.slice(32)
    this.keyPair = sign.keyPair.fromSeed(this.seed)
    return this
}


NyzoKey.prototype.fromSLIP10Seed = function (seed512Hex) {
    // HD Wallet from BIP39 - Uses hexseed to match official test vectors
    const seed512 = Buffer.from(seed512Hex.slice(0, 128), 'hex')
    const I = createHmac('sha512', Buffer.from(CURVE_KEY)).update(seed512).digest()
    this.seed = I.slice(0, 32)
    this.chainCode = I.slice(32)
    this.keyPair = sign.keyPair.fromSeed(this.seed)
    return this
}


NyzoKey.prototype.derive = function (index, hardened=true) {
    // Returns derived key at index
    if (hardened) index += HARDENED_OFFSET  // Harden by default, because ed25519
    if (index < HARDENED_OFFSET) throw new Error('Invalid derivation index');
    const indexBuffer = Buffer.allocUnsafe(4)
    indexBuffer.writeUInt32BE(index, 0)
    // key = Buffer.from(this.toSeedHex, 'hex')
    const data = Buffer.concat([Buffer.alloc(1, 0), this.seed, indexBuffer])
    const I = createHmac('sha512', Buffer.from(this.chainCode)).update(data).digest()
    const IL = I.slice(0, 32)
    const IR = I.slice(32)
    derived = new NyzoKey()
    derived.seed = IL
    derived.keyPair = sign.keyPair.fromSeed(derived.seed)
    derived.chainCode = IR
    return derived
}


NyzoKey.prototype.deriveBIP44 = function (index) {
    // Returns derived key m/44'/380'/index'
    return this.derive(44).derive(380).derive(index)
}


NyzoKey.prototype.fromPaperCode = function (passPhrase) {
    // Unique address from paper wallet, no chaincode
    this.seed = Buffer.from(bip39.mnemonicToEntropy(passPhrase), 'hex')
    this.keyPair = sign.keyPair.fromSeed(this.seed)
    this.chainCode = null
    return this
}


NyzoKey.prototype.fromNyzoPrivateSeed = function (nyzoString) {
    const keyObject = nyzoStringEncoder.decode(nyzoString)
    if (keyObject.constructor == NyzoStringPrivateSeed) {
        this.seed = keyObject.getSeed()
        //console.log(seed)
        //this.seed = Buffer.from(seed, 'hex')
        this.keyPair = sign.keyPair.fromSeed(this.seed)
        //console.log(this.toPrivKeyHexWithDashes())
        //console.log(this.toPubKeyHexWithDashes())
        this.chainCode = null
        return this
	}
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


NyzoKey.prototype.toPrivKeyHex = function () {
    return Buffer.from(this.keyPair.secretKey).toString('hex')
}


NyzoKey.prototype.toPrivKeyHexWithDashes = function () {
    return nyzoFormat.hexStringFromArrayWithDashes(this.keyPair.secretKey, 0, 64)
}


NyzoKey.prototype.toChainCodeHex = function () {
    return this.chainCode.toString('hex')
}


NyzoKey.prototype.LegacyPubKeyToNyzoString = function (legacyHex) {
    const nyzoString = NyzoStringPublicIdentifier.fromHex(legacyHex)
    return nyzoStringEncoder.encode(nyzoString)
}


NyzoKey.prototype.NyzoStringToLegacy  = function (nyzoString) {
    const keyObject = nyzoStringEncoder.decode(nyzoString)
    if (keyObject == null) {
		return(['Error', 'Not a nyzoString private or public key!'])
	}
	if (keyObject.constructor == NyzoStringPublicIdentifier) {
		return(['Public Id', nyzoFormat.hexStringFromArrayWithDashes(keyObject.getIdentifier(), 0, 32)])
	}
	else if (keyObject.constructor == NyzoStringPrivateSeed) {
		return(['Private Key', nyzoFormat.hexStringFromArrayWithDashes(keyObject.getSeed(), 0, 32)])
	}
	else {
		return(['Error', 'Not a nyzoString private or public key!'])
	}
}

NyzoKey.prototype.SignCycleTx = function (sig_, vote, delay) {
    //console.log("address " + this.toPubKeyHexWithDashes())
    const timestamp = new Int64(Date.now() + delay * 1000) // ms
    //console.log("timestamp " +timestamp)
    const amount = 0
    const receiverBuffer = this.toPubKey()
    const previousHashHeight = 0
    const previousBlockHashBuffer = new Buffer(0)
    const senderBuffer = this.toPubKey()
    const dataBuffer = new Buffer(0) //Buffer.from(dataHex, 'hex')
    const signatureBuffer = nyzoStringEncoder.decode(sig_).bytes // Fake sig
    const transactionSignatureBuffer = nyzoStringEncoder.decode(sig_).bytes
    var transaction = new NyzoStringTransaction(4, timestamp, amount, receiverBuffer, previousHashHeight, previousBlockHashBuffer, senderBuffer, dataBuffer, signatureBuffer, vote, transactionSignatureBuffer)
    //console.log("tx1")
    //console.log(transaction)
    //console.log(transaction.bytes.length)
    toSign = transaction.bytes.slice(0,1 + 8 + 32 + 1 + 64 )
    //console.log(toSign.toString("hex"))
    //console.log(toSign.length)
    const signature = sign.detached(toSign, this.keyPair.secretKey);
    //console.log("sig")
    //console.log(signature.toString("hex"))
    // tx with real sig
    var transaction2 = new NyzoStringTransaction(4, timestamp, amount, receiverBuffer, previousHashHeight, previousBlockHashBuffer, senderBuffer, dataBuffer, signature, vote, transactionSignatureBuffer)
    //console.log("tx2")
    //console.log(transaction2)
    //console.log("tx2b")
    //console.log(transaction2.bytes.toString("hex"))
    signed = nyzoStringEncoder.encode(transaction2)
    //console.log(signed)
    // hexStringAsUint8Array(
    // stringAsUint8Array(
    return signed
}

module.exports = {
    version: "0.0.9",
    NyzoKey
}
