// ==UserScript==
// @name         Neopets - Neoquest fixed attack button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  *scroll scroll* shit *scroll click* *scroll* *click* shit *click*
// @author       Miles
// @include      *www.neopets.com/games/neoquest/neoquest.phtml*
// @grant        none
// @downloadURL  https://github.com/warpKaiba/neopets-warez/raw/master/NPNeoquest.user.js
// ==/UserScript==

(function() {
    'use strict';

    var specialAttacks = document.querySelectorAll("[onclick^=setdata\\(\\'special\\']")
    if (specialAttacks != undefined) {
        console.log("specialAttacks not undefined")
        for (var i = 0; i < specialAttacks.length; i++) {
            specialAttacks[i].textContent += " "
            document.getElementsByClassName("contentModuleHeader")[0].insertAdjacentElement("afterend", specialAttacks[i])
            console.log(i+ " is the length")
        }
    }

    if(document.querySelector('[onclick*=attack]') != null) {

        document.getElementsByClassName("contentModuleHeader")[0].insertAdjacentHTML("afterend", '<a href=javascript:; id=milesAttack>Attack </a>')
        document.getElementById("milesAttack").addEventListener("click", function(){setdata('attack', 0)})
    }

    else if (document.querySelector('td[bgcolor="#9999ff"] a').textContent == "Click here to see what you found!") {
        document.getElementsByClassName("contentModuleHeader")[0].insertAdjacentHTML("afterend", '<a href=neoquest.phtml>Click here to see what you found!</a>')
    }

})();
