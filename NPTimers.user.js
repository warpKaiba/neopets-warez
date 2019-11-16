// ==UserScript==
// @name         Neopets - Kad+Snowager notifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *www.neopets.com*
// @grant        GM_notification
// @grant    GM_saveTab
// @grant    GM_getTab
// @grant    GM_getTabs
// @downloadURL  https://github.com/warpKaiba/neopets-warez/raw/master/NPTimers.user.js

// ==/UserScript==

(function() {

    var this_tab_data, all_tabs, n;
    var shouldRun = false;

    GM_getTab(function (o) {
        this_tab_data = o;
        n = this_tab_data.rand = Math.random();
        this_tab_data.running = false;
        GM_saveTab(this_tab_data);
        console.info(this_tab_data);

        GM_getTabs(function (db) {
            all_tabs = db;
            console.info(n);
            for (var i in all_tabs) {
                if (all_tabs[i].rand === n) console.info("I bet I am the tab named: " + i);
                else console.info("Other tab: " + i + " has value: " + all_tabs[i].rand);
            }
            console.log(Object.keys(all_tabs).length) //number of neopets tabs open
            console.info(all_tabs);
        });
    });

    var tabCheckerInterval = setInterval( function() {
        var i, isSomeoneElseRunning;
        GM_getTabs(function (db) {
            all_tabs = db;
        })

        if (this_tab_data.running == true) { //if this tab is already running, check the other tabs and stop running if your rand is lower
            console.log("this tab is runner!");
            isSomeoneElseRunning = false;
            for (i in all_tabs) {
                if (all_tabs[i].running == true && all_tabs[i].rand != n) {
                    if(all_tabs[i].rand > this_tab_data.rand) {
                        console.log("that tab is a bigger guy so i will stop running something.");
                        this_tab_data.running = false;
                        shouldRun = false;
                        GM_saveTab(this_tab_data);
                        clearTimers();
                    }
                }
            }
        }

        if(this_tab_data.running == true && shouldRun == true) {
            console.log("now i am actually LITERALLY runing.");
            shouldRun = false;
            onlyOneTab();
        }

        if (this_tab_data.running == false) {
            isSomeoneElseRunning = false;
            for (i in all_tabs) {
                if (all_tabs[i].running == true && all_tabs[i].rand != n) {
                    isSomeoneElseRunning = true;
                    console.log("Some other Tab is already running something")
                }
            }
            if (isSomeoneElseRunning == false) {
                this_tab_data.running = true;
                GM_saveTab(this_tab_data);
                console.log("I am going to be the runner of something next time");
                shouldRun = true;
            }
        }

        GM_getTabs(function (db) {
            all_tabs = db;
        })


    }, 1000)

    'use strict';

    function onlyOneTab() {

        checkKadoats();
        checkSnowager();
        console.log(neoData);
    }

    var neoTime = new Date();
    neoTime.setUTCHours(neoTime.getUTCHours() + 16);
    var neoSiteToCheck;
    var kadTimer;

    function clearTimers() {
        clearInterval(kadTimer);
    }



    if (localStorage.milesNeo == undefined) {
        console.log("Creating localStorage var");
        var initJSON = {
            snowager: false,
            snowagerTime: 0,
            kadoatery: false,
            kadoateryTime: 0,
            tarla: false,
            tarlaTime: 0};
        localStorage.setItem('milesNeo', JSON.stringify(initJSON));
    };

    var neoData = JSON.parse(localStorage.getItem('milesNeo'));

    function setStorage() {
        localStorage.setItem('milesNeo', JSON.stringify(neoData));
    }

    function checkSnowager() {
        if (neoTime.getUTCHours() == 6 || neoTime.getUTCHours() == 14 || neoTime.getUTCHours() == 22) {
            if (neoData.snowager == true) {
                if (new Date().getTime() - neoData.snowagerTime > (1000*60*60*1)) {
                    neoData.snowager = false;
                    setStorage();
                }
            }
            if (neoData.snowager == false) {
                GM_notification("Snowager is sleeping", "Neopets", null, function() {window.open("http://www.neopets.com/winter/snowager.phtml");})
                neoData.snowager = true;
                neoData.snowagerTime = new Date().getTime();
                setStorage();
            };
        };
    };

    function checkNeoSite() {
        //console.log("The Site Is:")
        //var parser = new DOMParser();
        //var htmlDoc = parser.parseFromString(neoSiteToCheck, 'text/html');
        //console.log(neoSiteToCheck);
        var numberOfHungryKads = neoSiteToCheck.match(/is very sad./mg).length;
        console.log(numberOfHungryKads + " kads");
        if (numberOfHungryKads >= 5) {
            GM_notification("There are " + numberOfHungryKads + " hungry Kadoaties!!!", "Neopets", "http://images.neopets.com/games/kadoatery/rainbow_sad.gif", function() {window.open("http://www.neopets.com/games/kadoatery/index.phtml?");})
            neoData.kadoatery = true;
            neoData.kadoateryTime = new Date().getTime();
            setStorage()
        }
    }


    function load(url) {
        var temp1 = new XMLHttpRequest();
        temp1.open("GET", url, true);
        temp1.onreadystatechange = function() {
            if (temp1.readyState === XMLHttpRequest.DONE && temp1.status === 200 ) {
                neoSiteToCheck = JSON.parse(JSON.stringify(temp1.responseText));
                checkNeoSite();
            }
        }
        setTimeout(function(){
            temp1.send()
        }, 100)
    }

    function checkKadoats() {
        kadTimer = setInterval(function() {
            if (neoData.kadoatery == true && new Date().getTime() - neoData.kadoateryTime > 1000*60*27) {
                neoData.kadoatery = false;
            }
            if (neoData.kadoatery == false) {
                load("http://www.neopets.com/games/kadoatery/index.phtml?")
            }

        }, 3002)
    }


    //GM_notification("Snowager is sleeping", "Neopets", null, function() {window.open("http://www.neopets.com/winter/snowager.phtml");})

    //GM_notification("Snowager is sleeping", "Neopets")
    //GM_notification("Kadoatery is stocked", "Neopets")
    //GM_notification("Tarla is ready", "Neopets")

})();


