// ==UserScript==
// @name         KG_ColorSpeedometer
// @namespace    KG_ColorSpeedometer
// @version      0.32
// @author       ChatGPT 5
// @description  Цветной индикатор скорости печати.
// @match        http*://*.klavogonki.ru/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klavogonki.ru
// @grant        none
// ==/UserScript==

/*
   Цветной спидометр, который вызывается по двойному клику по КГшной панели со спидометром\ошибками.
   Показывает приблизительную текущую скорость, учитывая исправления кнопкой Backspace.
   При этом Ctrl+Backspace (и иные хитрые комбинации) НЕ ПОДДЕРЖИВАЮТСЯ, так что чем активнее вы используете эти комбинации, тем больше будет завышена итоговая скорость.

   Спидометр работает ТОЛЬКО на странице заезда и его можно перетаскивать мышкой в любое место.
   Он как паралитик из фильма «1+1»: всегда будет находиться там, где вы его оставили в последний раз.
   Более того: если вы его спрятали, то в следующем заезде он не будет мозолить вам глаза, но если оставили − будет появляться аутоматычно™.
   Прячется по двойному клику по самому себе или по той же КГшной панели, откуда его вызывали.

   Приятного использования!

   Disclaimer: Данный юзерскрипт написан ИИ, с минимальной человекокоррекцией и распространяется как есть, безо всяких претензий и хотелок.
   Каждый человек сам кузнец своего счастья, поэтому может дополнять или изменять этот скрипт на своё личное усмотрение.

   Рекомендуется настроить под себя основные настройки (размер шрифта и палитру)
*/

(function () {
    'use strict';

    // === Основные настройки ===
    const FONT_SIZE = 40; // размер основного шрифта (в пикселях), от него же «пляшет» и размер всего блока
    const SHOW_ADDITIONAL_INFO = true; // показывать ли общее количество набранных символов и суммарное время под скоростью? (true | false)

    // цветовая палитра, которую можно (нужно!) менять на своё усмотрение
    // формат простой:
    //   скорость1: { bg: "#ЦВЕТ_ФОНА1", text: "#ЦВЕТ_ТЕКСТА1" },
    //   скорость2: { bg: "#ЦВЕТ_ФОНА2", text: "#ЦВЕТ_ТЕКСТА2" },
    //   скорость3: { bg: "#ЦВЕТ_ФОНА3", text: "#ЦВЕТ_ТЕКСТА3" },
    //   ...и т.д.
    // градация скорости может быть любая, не обязательно кратная 100, хоть по 5 знаков себе меняйте :D
    // предполагается, что каждый настраивает это под себя, под свои особенности цветовосприятия и под свои собственные конкретные цели.
    const palette = {
          0: { bg: "#e0e0e0", text: "#333333"},
        300: { bg: "#B784F7", text: "#FFFFFF" }, // too slooooow
        400: { bg: "#6666EE", text: "#FFFFFF" }, // good for letters
        500: { bg: "#2CB67D", text: "#FFFFFF" }, // nothing interesting
        600: { bg: "#FF66C4", text: "#000000" }, // nice speed!
        700: { bg: "#FFD23F", text: "#000000" }, // yeah, baby
        800: { bg: "#FF7F50", text: "#000000" }, // un-fucking-believable
        900: { bg: "#555555", text: "#EEEEEE" }, // IMPOSSIBRU!!
        1000: { bg: "#e0e0e0", text: "#FF0000"}, // YOU GOTTA BE KIDDING ME!!!
    };

    // === всё, что ниже − лучше не трогать
    const MIN_CHARS_COUNT = 2; // начинаем считать, когда нажато как минимум {MIN_CHARS_COUNT} клавиш
    const UPDATE_INTERVAL = 500; // интервал обновления спидометра, мс
    const STORAGE_KEY = "KG_COLOR_SPEEDOMETER_SETTINGS"; // имя ключа для локального хранилища браузера

    const paletteSorted = Object.keys(palette).map(Number).sort((a, b) => a - b);

    // === Счётчики ===
    let lastTime = null;
    let totalTime = 0;
    let totalChars = 0;
    let lastSpeed = 0;

    const input = document.getElementById('inputtext');
    if (!input) return;

    // === Настройки в localStorage ===
    function loadSettings() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { visible: true, top: "20px", left: "20px" };
        } catch {
            return { visible: true, top: "20px", left: "20px" };
        }
    }
    function saveSettings(newSettings) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    }
    let settings = loadSettings();

    // === UI ===
    let speedDiv, bigSpan, smallSpan;

    function createSpeedometer() {
        if (document.getElementById("color-speedometer")) return; // уже есть

        const size = FONT_SIZE * 2;
        speedDiv = document.createElement('div');
        speedDiv.id = 'color-speedometer';
        speedDiv.style.position = 'fixed';
        speedDiv.style.top = settings.top;
        speedDiv.style.left = settings.left;
        speedDiv.style.width = size*1.2 + 'px';
        speedDiv.style.height = size + 'px';
        speedDiv.style.display = 'flex';
        speedDiv.style.flexDirection = 'column';
        speedDiv.style.alignItems = 'center';
        speedDiv.style.justifyContent = 'center';
        speedDiv.style.borderRadius = '10px';
        speedDiv.style.padding = '5px 10px 2px 10px';
        speedDiv.style.zIndex = 999999;
        speedDiv.style.fontFamily = 'sans-serif';
        speedDiv.style.cursor = 'move';
        speedDiv.style.userSelect = 'none';
        speedDiv.style.textAlign = 'center';

        bigSpan = document.createElement('div');
        bigSpan.style.fontSize = FONT_SIZE + 'px';
        bigSpan.textContent = lastSpeed.toString();

        smallSpan = document.createElement('div');
        smallSpan.style.fontSize = Math.max((FONT_SIZE>>2), 10) + 'px';
        smallSpan.style.marginTop = '0px';
        if (SHOW_ADDITIONAL_INFO) {
            const sec = (totalTime / 1000).toFixed(1);
            smallSpan.innerHTML = `${totalChars} симв.<br/>${sec} сек.`;
        }

        speedDiv.appendChild(bigSpan);
        speedDiv.appendChild(smallSpan);
        document.body.appendChild(speedDiv);

        // закрытие по двойному клику
        speedDiv.ondblclick = () => {
            speedDiv.remove();
            settings.visible = false;
            saveSettings(settings);
        };

        // Drag’n’drop
        speedDiv.addEventListener('mousedown', (e) => {
            const shiftX = e.clientX - speedDiv.getBoundingClientRect().left;
            const shiftY = e.clientY - speedDiv.getBoundingClientRect().top;

            function onMouseMove(e) {
                speedDiv.style.left = (e.clientX - shiftX) + 'px';
                speedDiv.style.top = (e.clientY - shiftY) + 'px';
            }

            function onMouseUp() {
                settings.left = speedDiv.style.left;
                settings.top = speedDiv.style.top;
                saveSettings(settings);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // === Тоггл через speedpanel-canvas ===
    const toggleTarget = document.getElementById('speedpanel-canvas');
    if (toggleTarget) {
        toggleTarget.ondblclick = () => {
            if (document.getElementById('color-speedometer')) {
                // уже открыт → закрыть
                document.getElementById('color-speedometer').remove();
                settings.visible = false;
                saveSettings(settings);
            } else {
                // закрыт → открыть
                createSpeedometer();
                settings.visible = true;
                saveSettings(settings);
            }
        };
    }

    // === Логика ===
    input.addEventListener('keydown', (e) => {
        if (!(e.key.length === 1 || e.key === 'Backspace')) return;

        const now = Date.now();

        if (lastTime) {
            const dt = now - lastTime;
            totalTime += dt;
        }

        if (e.key === 'Backspace') {
            if (totalChars) totalChars--;
        } else totalChars++;

        lastTime = now;
    });

    setInterval(() => {
        if (totalChars > MIN_CHARS_COUNT && totalTime > 0 && lastTime) {
            const cps = totalChars / (totalTime / 1000);
            lastSpeed = Math.round(cps * 60);
        }

        if (!speedDiv) return;

        let chosen = null;
        for (const threshold of paletteSorted) {
            if (lastSpeed >= threshold) {
                chosen = palette[threshold];
            }
        }
        if (chosen) {
            speedDiv.style.backgroundColor = chosen.bg;
            speedDiv.style.color = chosen.text;
        }

        bigSpan.textContent = lastSpeed.toString();
        if (SHOW_ADDITIONAL_INFO) {
            const sec = (totalTime / 1000).toFixed(1);
            smallSpan.innerHTML = `${totalChars} симв.<br/>${sec} сек.`;
        }
    }, UPDATE_INTERVAL);

    // === Авто-показ при старте ===
    if (settings.visible) createSpeedometer();
})();
