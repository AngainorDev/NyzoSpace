const ccrypto = require('cardano-crypto.js')
const { NyzoKey } = require("../src/NyzoKey")

// From cardano-crypto.js tests
const sampleWalletMnemonicV1 = 'logic easily waste eager injury oval sentence wine bomb embrace gossip supreme'
const sampleWalletMnemonicV2 = 'cost dash dress stove morning robust group affair stomach vacant route volume yellow salute laugh'
const sampleRootKeypairV1Hex = 'd809b1b4b4c74734037f76aace501730a3fe2fca30b5102df99ad3f7c0103e48d54cde47e9041b31f3e6873d700d83f7a937bea746dadfa2c5b0a6a92502356ce6f04522f875c1563682ca876ddb04c2e2e3ae718e3ff9f11c03dd9f9dccf69869272d81c376382b8a87c21370a7ae9618df8da708d1a9490939ec54ebe43000'
const sampleRootKeypairV2Hex = 'a018cd746e128a0be0782b228c275473205445c33b9000a33dd5668b430b574426877cfe435fddda02409b839b7386f3738f10a30b95a225f4b720ee71d2505b5569bc9fa461f67b9355b3da8bd4298c5099fd4e001415117a59b424f85ce48cca8cc35f3c2be27b0b26562448a3a4b6bfd1a3828918b87ae76ce17ae96a8306'


const nyzoSeed1 = '0000000000000000-1111111111111111-2222222222222222-3333333333333333'
const nyzoBuffer1Hex = '0000000000000000111111111111111122222222222222223333333333333333'
const nyzoPubkey1Hex = '0ba351a7463852aa0eba49118b92af903aedf56970c4dab18540da7702aab99b'
const nyzoPubkey1 = '0ba351a7463852aa-0eba49118b92af90-3aedf56970c4dab1-8540da7702aab99b'


describe("Seed Tests", () => {
  test("Convert mnemonicV1 to root keypair", async () => {
    const parentWalletSecret = await ccrypto.mnemonicToRootKeypair(sampleWalletMnemonicV1, 1)
    // console.log(parentWalletSecret)
    expect(parentWalletSecret.toString('hex')).toBe(sampleRootKeypairV1Hex)
  })
  test("Convert mnemonicV2 to root keypair", async () => {
    const parentWalletSecret = await ccrypto.mnemonicToRootKeypair(sampleWalletMnemonicV2, 2)
    // console.log(parentWalletSecret)
    expect(parentWalletSecret.toString('hex')).toBe(sampleRootKeypairV2Hex)
  })
  test("Convert Nyzo seed to buffer", async () => {
    const nyzoKey = new NyzoKey(nyzoSeed1)
    expect(nyzoKey.seed.toString('hex')).toBe(nyzoBuffer1Hex)
  })
})

describe("Pubkey Tests", () => {
  test("Convert Nyzo seed to pubkey", async () => {
    const nyzoKey = new NyzoKey(nyzoSeed1)
    //console.log(nyzoKey.toPubKey())
    expect(nyzoKey.toPubKey().toString('hex')).toBe(nyzoPubkey1Hex)
  })
})
