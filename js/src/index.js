console.log("Hello Nyzo!")

const bip39 = require("bip39")
const QRCode = require('easyqrcodejs')
const { NyzoKey } = require("./NyzoKey")

import logo from './img/ID_80x80.png'
import nyzo512 from './img/nyzo512c.png'

import './css/bootstrap.min.css'

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


function getKeyRow2(index, seed, nyzoSeed, address, nyzoAddress, paperCode, tHeadClass='') {
    return  `
        <div class="col-12">
          <table class="table">
          <thead class="${tHeadClass}">
            <tr>
              <th>&nbsp;</th><th>Seed ${index}</th><th>Public Id ${index}</th>
            </tr>
          </thead>
            <tr>
              <td>Raw</td><td>${seed}</td><td>${address}</td>
            </tr>
            <tr>
              <td>NyzoString</td><td>${nyzoSeed}</td><td>${nyzoAddress}</td>
            </tr>
            <tr>
                <td colspan="3">paperCode ${index}: <input type="TEXT" class="form-control" value="${paperCode}"></td>
            </tr>
          </table>
        </div>
    `
}

function getKeyRowWithQR(index, seed, nyzoSeed, address, nyzoAddress, paperCode, tHeadClass='') {
    return  `
        <div class="col-12">
          <table class="table">
          <thead class="${tHeadClass}">
            <tr>
              <th>&nbsp;</th><th>Seed ${index}</th><th>Public Id ${index}</th><th>Address QR Code</th>
            </tr>
          </thead>
            <tr>
              <td>Raw</td><td>${seed}</td><td>${address}</td><td rowspan="3"><div class="qr" id="qrcode_${index}"></div></td>
            </tr>
            <tr>
              <td>NyzoString</td><td>${nyzoSeed}</td><td>${nyzoAddress}</td>
            </tr>
            <tr>
                <td colspan="3">paperCode ${index}: <input type="TEXT" class="form-control" value="${paperCode}"></td>
            </tr>
          </table>
        </div>
    `
}



function generate_options() {
    const x = document.querySelector("#options")
    if (x.style.display === "none") {
        x.style.display = "block"
    } else {
        x.style.display = "none"
    }
}


function generate_addresses_legacy() {
    document.querySelector("#BIP39-pass").value = "NYZO_ROCKS!"
    document.querySelector("#simple").checked = true
    generate_addresses()
}


function generate_addresses_ledger() {
    document.querySelector("#BIP39-pass").value = ""
    document.querySelector("#bip44").checked = true
    generate_addresses()
}


function generate_addresses() {
    const mnemonic = document.querySelector("#BIP39-input").value.trim()
    const pass  = document.querySelector("#BIP39-pass").value.trim()
    const MasterKey = new NyzoKey().fromBIP39(mnemonic, pass)
    const count = parseInt(document.querySelector("#BIP39-count").value, 10)
    const radios = document.getElementsByName('ns-derive')
    var derive = "simple"
    let i = 0
    for (i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            derive = radios[i].value
            break;
        }
    }
    // console.log(derive)
    const wrapper = document.querySelector("#addresses")
    let content = ''
    let extraClass=''
    let ids = []
    for (i=0; i<count; i++) {
        if (derive=='simple') {
            derived = MasterKey.derive(i)
        } else {
            derived = MasterKey.deriveBIP44(i)
        }
        content += getKeyRowWithQR(i, derived.toSeedHexWithDashes(), derived.toNyzoPrivateSeed(),
                                 derived.toPubKeyHexWithDashes(), derived.toNyzoPublicIdentifier(),
                                 derived.toPaperCode(), extraClass)
        ids.push(derived.toNyzoPublicIdentifier())
        if (extraClass =='') {extraClass = 'thead-light'} else {extraClass = ''}
    }
    wrapper.innerHTML = content
    let config = { text: "", // Content
						width: 240, // Width
						height: 240, // Height
						//colorDark: "#630900", // Dark color
						colorDark: "#000000", // Dark color
						colorLight: "#ffffff", // Light color

						PO: '#630900', // Global Position Outer color. if not set, the defaut is `colorDark`
						PI: '#630900',


						quietZone: 0,
						// === Logo
						logo: logo, // LOGO
						//					logo:"http://127.0.0.1:8020/easy-qrcodejs/demo/logo.png",
						//					logoWidth:80,
						//					logoHeight:80,
						//logoBackgroundColor: '#ffffff', // Logo background color, Invalid when `logBgTransparent` is true; default is '#ffffff'
						logoBackgroundTransparent: true, // Whether use transparent image, default is false
						backgroundImage: nyzo512,
						backgroundImageAlpha: 1,
						autoColor: false,
						correctLevel: QRCode.CorrectLevel.M // L, M, Q, H - don't use L, not enough dup info to allow for the logo
						}
    for (i=0; i<count; i++) {
        config.text = ids[i]
        let t = new QRCode(document.getElementById("qrcode_" + i), config)
    }
}

document.querySelector("#generate_mnemonic12").addEventListener("click", generate_mnemonic12)
document.querySelector("#generate_mnemonic24").addEventListener("click", generate_mnemonic24)
document.querySelector("#generate_addresses").addEventListener("click", generate_addresses)
document.querySelector("#generate_options").addEventListener("click", generate_options)
document.querySelector("#generate_addresses_legacy").addEventListener("click", generate_addresses_legacy)
document.querySelector("#generate_addresses_ledger").addEventListener("click", generate_addresses_ledger)

