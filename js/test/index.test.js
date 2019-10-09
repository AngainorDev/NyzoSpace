
const { NyzoFormat } = require("../src/NyzoFormat")
const { NyzoKey } = require("../src/NyzoKey")

const sampleWalletMnemonic1 = 'logic easily waste eager injury oval sentence wine bomb embrace gossip supreme'
const sampleSeed1 = '3ba3ed0935e23225-5d6835132697fc42-cb95e766e90d918e-d258c18717df14e0'
const samplePaperCode1 = 'desert buyer drastic hint case bargain interest allow basket cruise yellow machine rich victory option canvas muscle isolate normal loan imitate usage fatal boss'
const samplePub1 = '9aa6d752ca4f83e4-5087e18780997f06-93f2ba942e457c55-2103c7b0688f7143'
const sampleWalletMnemonic2 = 'cost dash dress stove morning robust group affair stomach vacant route volume yellow salute laugh'
const sampleSeed2 = 'd602bb4aad303c58-40706fa169bc8d7a-d658274ec93ec37a-d94965b715b79ce1'
const samplePaperCode2 = 'stock beyond sport foil adult club achieve assume pause evil cash volcano grain beauty depth chief sell strategy false slice image swift inform chest'
const samplePub2 = '814efed36dad003a-e7f186dca982d8b0-58fbfbc3e9b85f90-cfbcbc6dfde6068e'


const nyzoSeed1 = '0000000000000000-1111111111111111-2222222222222222-3333333333333333'
const nyzoBuffer1Hex = '0000000000000000111111111111111122222222222222223333333333333333'
const nyzoPubkey1Hex = '0ba351a7463852aa0eba49118b92af903aedf56970c4dab18540da7702aab99b'
const nyzoPubkey1 = '0ba351a7463852aa-0eba49118b92af90-3aedf56970c4dab1-8540da7702aab99b'


const derived_1 = '0b579bd21b2e2c23-7875312fab36758c-bdd567bf2df153e9-bff9515215979961'
const derived_314 = '7c81c71ad3f1a851-d9b999744ac59905-0925e25f27e20710-45f87c1c2883dbee'
const derived_1_1 = '22c9ba332e1e67c2-938b29be8d98aad4-8d67de646d5ec213-6776a454721b0120'


nyzoFormat = new NyzoFormat()


describe("Seed Tests", () => {
  test("Convert mnemonic1 to root keypair", () => {
    const parentKey = new NyzoKey().fromBIP39(sampleWalletMnemonic1)
    // console.log("Seed", parentKey.toSeedHexWithDashes())
    expect(parentKey.toSeedHexWithDashes()).toBe(sampleSeed1)
    // console.log("Hex", parentKey.toPubKeyHex())
    // console.log("Hex/dashes", parentKey.toPubKeyHexWithDashes())
    expect(parentKey.toPubKeyHexWithDashes()).toBe(samplePub1)
  })
  test("Convert mnemonic2 to root keypair", () => {
    const parentKey = new NyzoKey().fromBIP39(sampleWalletMnemonic2)
    // console.log("Seed", parentKey.toSeedHexWithDashes())
    expect(parentKey.toSeedHexWithDashes()).toBe(sampleSeed2)
    // console.log("Hex/dashes", parentKey.toPubKeyHexWithDashes())
    expect(parentKey.toPubKeyHexWithDashes()).toBe(samplePub2)
  })
  test("Convert Nyzo seed to buffer",  () => {
    const nyzoKey = new NyzoKey(nyzoSeed1)
    expect(nyzoKey.seed.toString('hex')).toBe(nyzoBuffer1Hex)
    const nyzoSeed2 = Buffer.from(nyzoFormat.hexStringToByteArray(nyzoSeed1))
    expect(nyzoSeed2.toString('hex')).toBe(nyzoBuffer1Hex)
  })
})


describe("Pubkey Tests", () => {
  test("Convert Nyzo seed to pubkey",  () => {
    const nyzoKey = new NyzoKey(nyzoSeed1)
    const nyzoPublic = nyzoKey.toPubKeyHexWithDashes()
    expect(nyzoPublic).toBe(nyzoPubkey1)
  })
  test("Convert Nyzo seed2 to pubkey",  () => {
    const nyzoKey = new NyzoKey(sampleSeed2)
    expect(nyzoKey.toPubKeyHexWithDashes()).toBe(samplePub2)
  })
})


describe("Papercodes Tests", () => {
  test("Convert sampleSeed1 to Papercode and back", () => {
    const singleKey = new NyzoKey(sampleSeed1)
    const paperCode = singleKey.toPaperCode()
    // console.log("Papercode 1", paperCode)
    const testKey = new NyzoKey().fromPaperCode(paperCode)
    expect(testKey.toSeedHexWithDashes()).toBe(sampleSeed1)
  })
  test("Convert sampleSeed2 to Papercode and back", () => {
    const singleKey = new NyzoKey(sampleSeed2)
    const paperCode = singleKey.toPaperCode()
    // console.log("Papercode 2", paperCode)
    const testKey = new NyzoKey().fromPaperCode(paperCode)
    expect(testKey.toSeedHexWithDashes()).toBe(sampleSeed2)
  })
})


describe("Derivation Tests", () => {
  test("Derive mnemonic1 /1", () => {
    const parentKey = new NyzoKey().fromBIP39(sampleWalletMnemonic1)
    derived = parentKey.derive(1)
    // console.log("Seed 1", derived.toSeedHexWithDashes())
    expect(derived.toSeedHexWithDashes()).toBe(derived_1)
  })
  test("Derive mnemonic1 /314", () => {
    const parentKey = new NyzoKey().fromBIP39(sampleWalletMnemonic1)
    derived = parentKey.derive(314)
    // console.log("Seed 314", derived.toSeedHexWithDashes())
    expect(derived.toSeedHexWithDashes()).toBe(derived_314)
  })
  test("Derive mnemonic1 /1/1", () => {
    const parentKey = new NyzoKey().fromBIP39(sampleWalletMnemonic1)
    derived1 = parentKey.derive(1)
    derived1_1 = derived1.derive(1)
    // console.log("Seed 1/1", derived1_1.toSeedHexWithDashes())
    expect(derived1_1.toSeedHexWithDashes()).toBe(derived_1_1)
  })
})
