console.log("Hello Nyzo!")

const bip39 = require("bip39")
const { NyzoKey } = require("./NyzoKey")

function generate_mnemonic() {
  const mnemonic = bip39.generateMnemonic(128)
  const element = document.querySelector("#BIP39-input")
  element.value = mnemonic
}

function getKeyRow(index, seed, address, paperCode) {
    return  `
        <div class="col-12 col-md-4 col-xl-6">
          <form>
            Seed ${index}<input type="TEXT" class="form-control" value="${seed}"><br />
            Public Id ${index}<input type="TEXT" class="form-control" value="${address}"><br />
            paperCode ${index}<input type="TEXT" class="form-control" value="${paperCode}"><br />
          </form>
        </div>
    `
}

function generate_addresses() {
    const mnemonic = document.querySelector("#BIP39-input").value.trim()
    const MasterKey = new NyzoKey().fromBIP39(mnemonic)
    const count = parseInt(document.querySelector("#BIP39-count").value, 10)
    const wrapper = document.querySelector("#addresses")
    let content = ''
    for (i=1; i<=count; i++) {
        derived = MasterKey.derive(i)
        content += getKeyRow(i, derived.toSeedHexWithDashes(), derived.toPubKeyHexWithDashes() , derived.toPaperCode())
    }
    wrapper.innerHTML = content
}

document.querySelector("#generate_mnemonic").addEventListener("click", generate_mnemonic)
document.querySelector("#generate_addresses").addEventListener("click", generate_addresses)
