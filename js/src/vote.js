
const QRCode = require('easyqrcodejs')
const { NyzoKey } = require("./NyzoKey")

import logo_id from './img/ID_80x80.png'
import logo_sig from './img/ID_80x80.png'
import logo_key from './img/KEY_80x80.png'
import nyzo512 from './img/nyzo512c.png'

//import './css/bootstrap.min.css'

function getQRConfig(text, logo) {
    return { text: text, // Content
						width: 240, // Width
						height: 240, // Height
						colorDark: "#000000", // Dark color
						colorLight: "#ffffff", // Light color
						PO: '#630900', // Global Position Outer color. if not set, the defaut is `colorDark`
						PI: '#630900',
						quietZone: 0,
						//logo: logo, // LOGO
						logoBackgroundTransparent: true, // Whether use transparent image, default is false
						backgroundImage: nyzo512,
						backgroundImageAlpha: 1,
						autoColor: false,
						correctLevel: QRCode.CorrectLevel.M // L, M, Q, H - don't use L, not enough dup info to allow for the logo
						}}


function generate_tx() {
    const nyzoString = document.querySelector("#ns-input").value.trim()
    /*const key = new NyzoKey()
    const list = key.NyzoStringToLegacy(nyzoString)
    const name = list[0]
    const value = list[1]*/
    const key_ = document.querySelector("#ns-input").value.trim()
    const sig_ = document.querySelector("#ns-txsig").value.trim()
    const radios = document.getElementsByName('ns-vote')
    var vote = "1"
    for (var i = 0, length = radios.length; i < length; i++) {
        console.log(radios[i])
        if (radios[i].checked) {
            vote = radios[i].value
            break;
        }
    }
    //const vote = document.querySelector("#ns-vote").value.trim()
    console.log(vote)
    const delay = document.querySelector("#ns-delay").value.trim()
    let public_id = ''
    let out
    const wrapper = document.querySelector("#output")
        const key = new NyzoKey()
        key.fromNyzoPrivateSeed(key_)
        signed = key.SignCycleTx(sig_, vote, delay)
        wrapper.innerHTML = '<input style="width:100%;" type="text" id="signed" value="'+signed+'" /><br/>&nbsp;<br/>'
        wrapper.innerHTML += '<a target="_blank" href=http://client.nyzo.co/forwardTransaction?transaction="'+signed+'" >Forward to Cycle</a><br/>&nbsp;<br/>'
        wrapper.innerHTML += '<center><div id="qrcode_signed" class="qr"></div></center><br/>&nbsp;<br/>'
        let qr = new QRCode(document.getElementById("qrcode_signed"), signed, logo_sig)

}


function init() {
    const url = location.search
    var parts = url.substring(1).split('&')
    const para_str = parts[0];
    var parameter_obj = {}
    if( para_str != undefined && para_str != '' ){
      for(var i=0;i<parts.length;i++){
       var split_val = parts[i].split('=')
       if(split_val[0] == undefined || split_val[0] == '' )
         continue
       var value = split_val[1]
       if(value == undefined){
         value = ""
       }
       parameter_obj[split_val[0]] = value
      }
     //console.log(parameter_obj)
    }
    if (parameter_obj["delay"] != null) {
        document.querySelector("#ns-delay").value = parameter_obj["delay"]
    }
    if (parameter_obj["sig"] != null) {
        document.querySelector("#ns-txsig").value = parameter_obj["sig"]
    }
    if (parameter_obj["key"] != null) {
        document.querySelector("#ns-input").value = parameter_obj["key"]
    }
}


document.querySelector("#generate_tx").addEventListener("click", generate_tx)
init()
