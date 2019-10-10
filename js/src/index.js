console.log("Hello Nyzo!")

const bip39 = require("bip39")
const { NyzoKey } = require("./NyzoKey")


function generate_mnemonic(bits=128) {
  const mnemonic = bip39.generateMnemonic(bits)
  const element = document.querySelector("#BIP39-input")
  element.value = mnemonic
}


function generate_mnemonic12() {
    generate_mnemonic(128)
}


function generate_mnemonic24() {
    generate_mnemonic(256)
}


function getKeyRow(index, seed, address, paperCode, extraClass='') {
    return  `
        <div class="col-12">
          <form>
            Seed ${index}: <input type="TEXT" class="form-control" value="${seed}"> Public Id ${index}: <input type="TEXT" class="form-control" value="${address}"><br />
            paperCode ${index}: <input type="TEXT" class="form-control" value="${paperCode}"><br />
          </form>
        </div>
    `
}


function getKeyRow2(index, seed, address, paperCode, tHeadClass='') {
    return  `
        <div class="col-12">
          <table class="table">
          <thead class="${tHeadClass}">
            <tr>
              <th>Seed ${index}</th><th>Public Id ${index}</th>
            </tr>
          </thead>
            <tr>
              <td>${seed}</td><td>${address}</td>
            </tr>
            <tr>
                <td colspan="2">paperCode ${index}: <input type="TEXT" class="form-control" value="${paperCode}"></td>
            </tr>
          </table>
        </div>
    `
}


function generate_addresses() {
    const mnemonic = document.querySelector("#BIP39-input").value.trim()
    const MasterKey = new NyzoKey().fromBIP39(mnemonic)
    const count = parseInt(document.querySelector("#BIP39-count").value, 10)
    const wrapper = document.querySelector("#addresses")
    let content = ''
    let extraClass=''
    for (i=1; i<=count; i++) {
        derived = MasterKey.derive(i)
        content += getKeyRow2(i, derived.toSeedHexWithDashes(), derived.toPubKeyHexWithDashes() , derived.toPaperCode(), extraClass)
        if (extraClass =='') {extraClass = 'thead-light'} else {extraClass = ''}
    }
    wrapper.innerHTML = content
}

document.querySelector("#generate_mnemonic12").addEventListener("click", generate_mnemonic12)
document.querySelector("#generate_mnemonic24").addEventListener("click", generate_mnemonic24)
document.querySelector("#generate_addresses").addEventListener("click", generate_addresses)
