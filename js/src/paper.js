
const QRCode = require('easyqrcodejs')
const { NyzoKey } = require("./NyzoKey")

import logo_id from './img/ID_80x80.png'
import logo_key from './img/KEY_80x80.png'
import nyzo512 from './img/nyzo512b.png'

import paperbg from './img/paper/default/wallet.png'

import './img/paper/paper.css'

import getWalletsNames from './getWalletsNames'
import lazyLoadImage from './lazyLoadImage';

import './css/bootstrap.min.css'

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
    const img = document.getElementById("paperbg")
    lazyLoadImage(document.querySelector("#wallet_template").value, "wallet", img);
}


function template_changed() {
    const select_elem = document.querySelector("#wallet_template")
    //console.log(select_elem.value)
    const img = document.getElementById("preview_img")
    lazyLoadImage(document.querySelector("#wallet_template").value, "front", img);
}

function fill_select() {
    const walletNames = getWalletsNames()
    const select_elem = document.querySelector("#wallet_template")
    walletNames.forEach((element, index) => {
      const option_elem = document.createElement('option');
      // Add index to option_elem
      option_elem.value = element;
      // Add element HTML
      option_elem.textContent = element;
      // Append option_elem to select_elem
      select_elem.appendChild(option_elem);
    });
}


document.querySelector("#generate_paper").addEventListener("click", generate_paper)
fill_select()
document.querySelector("#wallet_template").addEventListener("change", template_changed)
template_changed()
