// ==UserScript==
// @name         KG_RestartGameShortcut
// @namespace    KG_RestartGameShortcut
// @version      0.2
// @description  alternate game restart on shift+alt+backspace (instead of ctrl+→), works without restrictions and can be used in mid-game
// @author       un4given (111001)
// @match        http*://*.klavogonki.ru/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klavogonki.ru
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener("keyup", (e) => {
        if (e.code == 'Backspace' && e.altKey && e.shiftKey) {
            var gd = document.getElementById('gamedesc');
            var _gametype = gd.children[0].className.replace('gametype-', '');
            var _types = {'открытая игра':'normal', 'игра с друзьями':'private', 'одиночный заезд':'practice'};
            var _type;
            var _addParams='';

            var gameinfo = gd.childNodes[1].textContent;

            //get type
            Object.keys(_types).forEach((x)=>{if (gameinfo.includes(x)) {_type=_types[x]}})

            if (_gametype == 'voc') {
                _addParams += '&voc=' + gd.children[0].children[0].href.split('/')[4];
            }

            //get timeout
            var _timeout = gameinfo.match(/таймаут.*?(\d+).*сек/)[1]

            //get from\to
            var _from = 1;
            var _to = 9;

            if (gameinfo.includes('для ')) {
                var _levels = {'новичков':1, 'любителей':2, 'таксистов':3, 'профи':4, 'гонщиков':5, 'маньяков':6, 'суперменов':7, 'кибергонщиков':8, 'экстракиберов':9};
                var matches = gameinfo.match(/для ([а-я]+)–([а-я]+)/);
                _from = _levels[matches[1]];
                _to = _levels[matches[2]];
            }

            //get qual, if needed
            if (gameinfo.includes('квалификация')) {
                _addParams+='&qual=on';
            }

            window.location.href=`${window.location.origin}/create/?type=${_type}&level_from=${_from}&level_to=${_to}&timeout=${_timeout}&gametype=${_gametype}${_addParams}&submit=1`;
            if (!e.ctrlKey && (_type != 'practice'))
                localStorage.KG_RGS_autostart=1;
        }
    });

    //autostart game, if needed
    if ((document.getElementById('paused').style.display=='') && localStorage.KG_RGS_autostart) {
        localStorage.removeItem('KG_RGS_autostart');
        document.getElementById('host_start').click();
    }
})();