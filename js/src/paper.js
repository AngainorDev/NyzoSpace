
const QRCode = require('easyqrcodejs')
const { NyzoKey } = require("./NyzoKey")

import logo_id from './img/ID_80x80.png'
import logo_key from './img/KEY_80x80.png'
import nyzo512 from './img/nyzo512b.png'

import paperbg from './img/paper/simple/nyzo-simple-wallet.ok.png'

import './img/paper/paper.css'

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
						backgroundImageAlpha: 0.3,
						autoColor: false,
						correctLevel: QRCode.CorrectLevel.M // L, M, Q, H - don't use L, not enough dup info to allow for the logo
						}}


function mapToPaper(map, type='') {
/*
    let out = '<div class="col-12"><table class="table">'
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
*/
    let out = ''
    out = '<div id="paperkeyarea">'
    out += '<div id="keyarea1" class="keyarea art">'
    out += '<div class="artwallet" id="artwallet1">'
    out += '<img id="paperbg" class="paperbg" src="'+paperbg+'">'
    out += '<div id="qrcode_private" class="qr"></div>'
    out += '<div id="qrcode_public" class="qr"></div>'
    out += '<div class="paper_pub" id="paper_pub">'+map['Public Id']+'</div>'
    out += '<div class="paper_priv" id="paper_priv">'+map['Nyzo String']+'</div>'
    out += '</div>'
    out += '</div>'
    out += '</div>'
    out += '<button class="btn btn-primary" type="button" onclick="window.print();" id="print_paper">Print it!</button>'

    return out

}

function generate_paper() {
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
        // TODO: Error
        alert("Need a key_")
    }
    const wrapper = document.querySelector("#output")
    wrapper.innerHTML = mapToPaper(outMap)
    if (list[0] == 'Private Key') {
        let qr = new QRCode(document.getElementById("qrcode_private"), getQRConfig(nyzoString, logo_key))
    }
    let qr2 = new QRCode(document.getElementById("qrcode_public"), getQRConfig(public_id, logo_id))

}


document.querySelector("#generate_paper").addEventListener("click", generate_paper)
