// ==UserScript==
// @name         KG_NavUsers
// @namespace    KG_NavUsers
// @version      1.0
// @description  navigate to prev\next user with arrow keys (try to use shift\ctl\alt and combinations)
// @author       un4given (111001)
// @match        http*://*.klavogonki.ru/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klavogonki.ru
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var curUserID, d, keys=['shiftKey', 'altKey', 'ctrlKey'], nextUserID, r;

    function gotoNextUser(curUserID, nextUserID) {
        var r = new RegExp(`${curUserID.toString()}`);
        location.href = location.href.replace(r, nextUserID.toString());
    }

    window.addEventListener("keyup", (e) => {
        switch (e.code) {
            case 'ArrowLeft':
            case 'ArrowRight':
                curUserID = parseInt(location.href.match(/.+?(\d+)/)[1]);
                d = (e.code == 'ArrowLeft')?-1:1;

                keys.forEach((k) => {if (e[k]) d*=10});

                nextUserID = curUserID + d;
                gotoNextUser(curUserID, nextUserID);
                break;

            case 'ArrowUp':
            case 'ArrowDown':
                curUserID = parseInt(location.href.match(/.+?(\d+)/)[1]);
                d = (e.code == 'ArrowDown')?-10:10;

                keys.forEach((k) => {if (e[k]) d*=10});

                nextUserID = (Math.floor(curUserID/Math.abs(d)))*Math.abs(d);
                if (Math.sign(d) == 1 || nextUserID == curUserID) nextUserID += d;
                gotoNextUser(curUserID, nextUserID);
                break;
        }
    });
})();