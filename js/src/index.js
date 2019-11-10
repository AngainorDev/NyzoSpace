console.log("Hello Nyzo!")

const bip39 = require("bip39")
const QRCode = require('easyqrcodejs')
const { NyzoKey } = require("./NyzoKey")

import logo from './img/ID_80x80.png'
import nyzo512 from './img/nyzo512c.png'


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



function generate_addresses() {
    const mnemonic = document.querySelector("#BIP39-input").value.trim()
    const MasterKey = new NyzoKey().fromBIP39(mnemonic)
    const count = parseInt(document.querySelector("#BIP39-count").value, 10)
    const wrapper = document.querySelector("#addresses")
    let content = ''
    let extraClass=''
    let ids = []
    let i = 0
    for (i=1; i<=count; i++) {
        derived = MasterKey.derive(i)
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
    for (i=1; i<=count; i++) {
        config.text = ids[i-1]
        let t = new QRCode(document.getElementById("qrcode_" + i), config)
    }
}

document.querySelector("#generate_mnemonic12").addEventListener("click", generate_mnemonic12)
document.querySelector("#generate_mnemonic24").addEventListener("click", generate_mnemonic24)
document.querySelector("#generate_addresses").addEventListener("click", generate_addresses)
