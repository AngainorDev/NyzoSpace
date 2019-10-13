
const { NyzoFormat } = require("../src/NyzoFormat")
const { NyzoKey } = require("../src/NyzoKey")

const { NyzoStringPublicIdentifier } = require("nyzostrings/src/NyzoStringPublicIdentifier.js")
const { NyzoStringPrivateSeed } = require("nyzostrings/src/NyzoStringPrivateSeed.js")
const { nyzoStringEncoder } = require("nyzostrings/src/NyzoStringEncoder.js")

const sampleWalletMnemonic1 = 'logic easily waste eager injury oval sentence wine bomb embrace gossip supreme'
const sampleSeed1 = '75d66f15555da95f-c259437726de6006-fb62d8dd5d5fa8f0-7cc2b089795b21b7'
const samplePaperCode1 = 'desert buyer drastic hint case bargain interest allow basket cruise yellow machine rich victory option canvas muscle isolate normal loan imitate usage fatal boss'
const samplePub1 = '892976f8ff62ec32-3394fb4b26095160-8045e87abe3d4faa-ac2abcfe2e4d4c46'
const sampleWalletMnemonic2 = 'cost dash dress stove morning robust group affair stomach vacant route volume yellow salute laugh'
const sampleSeed2 = 'c477bd569cb86e09-675484a8026a6757-5f06ca6a3c427c57-02518acff7af2e54'
const samplePaperCode2 = 'stock beyond sport foil adult club achieve assume pause evil cash volcano grain beauty depth chief sell strategy false slice image swift inform chest'
const samplePub2 = '2a8fc0e32b3038a5-17e4f969ecd74198-fc7ebeef682fe714-332cd6f7a922382c'


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
    //console.log("Seed1", parentKey.toSeedHexWithDashes())
    // console.log("Hex", parentKey.toPubKeyHex())
    //console.log("Hex/dashes1", parentKey.toPubKeyHexWithDashes())
    expect(parentKey.toSeedHexWithDashes()).toBe(sampleSeed1)
    expect(parentKey.toPubKeyHexWithDashes()).toBe(samplePub1)
  })
  test("Convert mnemonic2 to root keypair", () => {
    const parentKey = new NyzoKey().fromBIP39(sampleWalletMnemonic2)
    //console.log("Seed2", parentKey.toSeedHexWithDashes())
    //console.log("Hex/dashes2", parentKey.toPubKeyHexWithDashes())
    expect(parentKey.toSeedHexWithDashes()).toBe(sampleSeed2)
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


describe("Derivation Tests slip-0010", () => {
  test("Derive vector1 m", () => {
    const parentKey = new NyzoKey().fromSLIP10Seed('000102030405060708090a0b0c0d0e0f')
    //console.log("keypair", parentKey.keyPair)
    //console.log("ChainCode", parentKey.toChainCodeHex())
    //console.log("Seed", parentKey.toSeedHex())
    //console.log("priv hex", parentKey.toPrivKeyHex())
    //console.log("pub Hex", parentKey.toPubKeyHex())
    expect(parentKey.toChainCodeHex()).toBe('90046a93de5380a72b5e45010748567d5ea02bbf6522f979e05c0d8d8ca9fffb')
    expect(parentKey.toSeedHex()).toBe('2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7')
    expect(parentKey.toPubKeyHex()).toBe('a4b2856bfec510abab89753fac1ac0e1112364e7d250545963f135f2a33188ed')
  })
  test("Derive vector1 m/0h", () => {
    const parentKey = new NyzoKey().fromSLIP10Seed('000102030405060708090a0b0c0d0e0f')
    const derived = parentKey.derive(0)  // hardened by default
    //console.log("keypair", parentKey.keyPair)
    //console.log("ChainCode", derived.toChainCodeHex())
    //console.log("Seed", derived.toSeedHex())
    //console.log("priv hex", parentKey.toPrivKeyHex())
    //console.log("pub Hex", derived.toPubKeyHex())
    expect(derived.toChainCodeHex()).toBe('8b59aa11380b624e81507a27fedda59fea6d0b779a778918a2fd3590e16e9c69')
    expect(derived.toSeedHex()).toBe('68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3')
    expect(derived.toPubKeyHex()).toBe('8c8a13df77a28f3445213a0f432fde644acaa215fc72dcdf300d5efaa85d350c')
  })
  test("Derive vector1 4 remaining tests", () => {
    const parentKey = new NyzoKey().fromSLIP10Seed('000102030405060708090a0b0c0d0e0f')
    const derived_0 = parentKey.derive(0)
    const derived_0_1 = derived_0.derive(1)
    expect(derived_0_1.toChainCodeHex()).toBe('a320425f77d1b5c2505a6b1b27382b37368ee640e3557c315416801243552f14')
    expect(derived_0_1.toSeedHex()).toBe('b1d0bad404bf35da785a64ca1ac54b2617211d2777696fbffaf208f746ae84f2')
    expect(derived_0_1.toPubKeyHex()).toBe('1932a5270f335bed617d5b935c80aedb1a35bd9fc1e31acafd5372c30f5c1187')
    const derived_0_1_2 = derived_0_1.derive(2)
    expect(derived_0_1_2.toChainCodeHex()).toBe('2e69929e00b5ab250f49c3fb1c12f252de4fed2c1db88387094a0f8c4c9ccd6c')
    expect(derived_0_1_2.toSeedHex()).toBe('92a5b23c0b8a99e37d07df3fb9966917f5d06e02ddbd909c7e184371463e9fc9')
    expect(derived_0_1_2.toPubKeyHex()).toBe('ae98736566d30ed0e9d2f4486a64bc95740d89c7db33f52121f8ea8f76ff0fc1')
    const derived_0_1_2_2 = derived_0_1_2.derive(2)
    expect(derived_0_1_2_2.toChainCodeHex()).toBe('8f6d87f93d750e0efccda017d662a1b31a266e4a6f5993b15f5c1f07f74dd5cc')
    expect(derived_0_1_2_2.toSeedHex()).toBe('30d1dc7e5fc04c31219ab25a27ae00b50f6fd66622f6e9c913253d6511d1e662')
    expect(derived_0_1_2_2.toPubKeyHex()).toBe('8abae2d66361c879b900d204ad2cc4984fa2aa344dd7ddc46007329ac76c429c')
    const derived_0_1_2_2_1000000000 = derived_0_1_2_2.derive(1000000000)
    expect(derived_0_1_2_2_1000000000.toChainCodeHex()).toBe('68789923a0cac2cd5a29172a475fe9e0fb14cd6adb5ad98a3fa70333e7afa230')
    expect(derived_0_1_2_2_1000000000.toSeedHex()).toBe('8f94d394a8e8fd6b1bc2f3f49f5c47e385281d5c17e65324b0f62483e37e8793')
    expect(derived_0_1_2_2_1000000000.toPubKeyHex()).toBe('3c24da049451555d51a7014a37337aa4e12d41e485abccfa46b47dfb2af54b7a')
  })
  test("Derive vector2 m", () => {
    const parentKey = new NyzoKey().fromSLIP10Seed('fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542')
    /*console.log("ChainCode", parentKey.toChainCodeHex())
    console.log("Seed", parentKey.toSeedHex())
    console.log("priv hex", parentKey.toPrivKeyHex())
    console.log("pub Hex", parentKey.toPubKeyHex())*/
    expect(parentKey.toChainCodeHex()).toBe('ef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b')
    expect(parentKey.toSeedHex()).toBe('171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012')
    expect(parentKey.toPubKeyHex()).toBe('8fe9693f8fa62a4305a140b9764c5ee01e455963744fe18204b4fb948249308a')
  })
  test("Derive vector2 m/0h", () => {
    const parentKey = new NyzoKey().fromSLIP10Seed('fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542')
    const derived = parentKey.derive(0)  // hardened by default
    expect(derived.toChainCodeHex()).toBe('0b78a3226f915c082bf118f83618a618ab6dec793752624cbeb622acb562862d')
    expect(derived.toSeedHex()).toBe('1559eb2bbec5790b0c65d8693e4d0875b1747f4970ae8b650486ed7470845635')
    expect(derived.toPubKeyHex()).toBe('86fab68dcb57aa196c77c5f264f215a112c22a912c10d123b0d03c3c28ef1037')
  })
})


describe("Nyzo Strings Tests", () => {
  test("Nyzo Seed and pubkey 1",  () => {
    const nyzoKey = new NyzoKey(nyzoSeed1)
    const nyzoSeed = nyzoKey.toNyzoPrivateSeed()
    // console.log(nyzoSeed)
    expect(nyzoSeed).toBe('key_8000000000004h4h4h4h4h4z8z8z8z8z8AcRcRcRcRcR3ry0ZHS5')
    const nyzoPublic = nyzoKey.toNyzoPublicIdentifier()
    // console.log(nyzoPublic)
    expect(nyzoPublic).toBe('id__80LAkru6e5aH3IG94pLiIX0YZwmGtcjrJpm0UEt2HIDsCCL5S3XT')
  })
  test("Nyzo Seed and pubkey 2",  () => {
    const nyzoKey = new NyzoKey(sampleSeed2)
    const nyzoSeed = nyzoKey.toNyzoPrivateSeed()
    // console.log(nyzoSeed)
    expect(nyzoSeed).toBe('key_8chVMmrtL6W9qTi4H09HqTuw1JGHf49-mN9hzJ_VIQXkQyJhG8ei')
    const nyzoPublic = nyzoKey.toNyzoPublicIdentifier()
    // console.log(nyzoPublic)
    expect(nyzoPublic).toBe('id__82HfNecIc3zC5~jXrvRogqA-wIZMr2_E53cJTMvG8AxJ3GRqsZ7W')
  })
})


