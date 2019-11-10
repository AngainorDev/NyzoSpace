
const QRCode = require('easyqrcodejs')
const { NyzoKey } = require("./NyzoKey")

import logo_id from './img/ID_80x80.png'
import logo_key from './img/KEY_80x80.png'
import nyzo512 from './img/nyzo512c.png'


function getQRConfig(text, logo) {
    return { text: text, // Content
						width: 240, // Width
						height: 240, // Height
						colorDark: "#000000", // Dark color
						colorLight: "#ffffff", // Light color
						PO: '#630900', // Global Position Outer color. if not set, the defaut is `colorDark`
						PI: '#630900',
						quietZone: 0,
						logo: logo, // LOGO
						logoBackgroundTransparent: true, // Whether use transparent image, default is false
						backgroundImage: nyzo512,
						backgroundImageAlpha: 1,
						autoColor: false,
						correctLevel: QRCode.CorrectLevel.M // L, M, Q, H - don't use L, not enough dup info to allow for the logo
						}}


function mapToTable(map, tHeadClass='') {
    let out = '<div class="col-12"><table class="table">'
    //let td =  '<td rowspan="'+Object.keys(map).length+'"><div class="qr" id="qrcode"></div></td>'
    let td = ''
    let qr = ''
    for (var key in map) {
        const value = map[key]
        qr = ''
        if (key == 'Private Key') { qr = '<div class="qr" style="margin:20px;" id="qrcode_private"></div'}
        if (key == 'Public Id') { qr = '<div class="qr" style="margin:20px;" id="qrcode_public"></div'}
        out +=  '<tr><td>'+key+'</td><td><input type="text" style="width:100%" value="'+value+'">'+qr+'</td>'+td+'</tr>'
        td = ''
    }
    out += "</table></div>"
    return out
}


function generate_from_privk() {
    const legacy_key = document.querySelector("#privk-input").value.trim()
    const key = new NyzoKey(legacy_key)
    const outMap = {"Legacy Private Key": legacy_key,
    "Private Key": key.toNyzoPrivateSeed(),
    "Public Id": key.toNyzoPublicIdentifier()
    }
    const wrapper = document.querySelector("#output")
    wrapper.innerHTML = mapToTable(outMap)
    let qr = new QRCode(document.getElementById("qrcode_private"), getQRConfig(key.toNyzoPrivateSeed(), logo_key))
    let qr2 = new QRCode(document.getElementById("qrcode_public"), getQRConfig(key.toNyzoPublicIdentifier(), logo_id))
}


function generate_from_pubk() {
    const legacy_public = document.querySelector("#pubk-input").value.trim()
    const key = new NyzoKey()
    const outMap = {"Legacy Public Key": legacy_public,
    "Public Id": key.LegacyPubKeyToNyzoString(legacy_public)
    }
    const wrapper = document.querySelector("#output")
    wrapper.innerHTML = mapToTable(outMap)
    let qr = new QRCode(document.getElementById("qrcode_public"), getQRConfig(key.LegacyPubKeyToNyzoString(legacy_public), logo_id))
}


function generate_from_ns() {
    const nyzoString = document.querySelector("#ns-input").value.trim()
    const key = new NyzoKey()
    const list = key.NyzoStringToLegacy(nyzoString)
    const name = list[0]
    const value = list[1]
    let public_id = ''
    let outMap
    if (name == 'Private Key') {
        const key2 = new NyzoKey(value)
        outMap = {"Nyzo String": nyzoString,
        [`${name}`]: value,
        "Public Id": key2.toNyzoPublicIdentifier()}
        public_id = key2.toNyzoPublicIdentifier()
    }  else {
        outMap = {"Nyzo String": nyzoString, [`${name}`]: value}
        public_id = list[1]
    }
    const wrapper = document.querySelector("#output")
    wrapper.innerHTML = mapToTable(outMap)
    if (list[0] == 'Private Key') {
        let qr = new QRCode(document.getElementById("qrcode_private"), getQRConfig(list[1], logo_key))
    }
    let qr2 = new QRCode(document.getElementById("qrcode_public"), getQRConfig(public_id, logo_id))

}


document.querySelector("#generate_from_privk").addEventListener("click", generate_from_privk)
document.querySelector("#generate_from_pubk").addEventListener("click", generate_from_pubk)
document.querySelector("#generate_from_ns").addEventListener("click", generate_from_ns)
