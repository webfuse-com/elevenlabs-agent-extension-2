import { activateOrb } from "./popup.orb.js";


navigator.mediaDevices
    .getUserMedia({ audio: true });

document
    .addEventListener("DOMContentLoaded", () => {
        VoiceAgent.start();

        activateOrb("false", 25);

        const cssPropSize = (name) => {
            return parseInt(
                window.getComputedStyle(document.body)
                    .getPropertyValue(name)
            );
        };

        const size = [];
        size.push([
            cssPropSize("--diameter") * 1.5 + 16 + 4 * cssPropSize("--padding") + 2 * cssPropSize("--diameter") + 2,
            cssPropSize("--margin-top") + cssPropSize("--diameter") * 1.5 + 16 + 2
        ]);
        size.push([
            Math.max(size[0][0], 420),
            size[0][1] + cssPropSize("--padding") + cssPropSize("--maxsection-height") + 2
        ]);

        const voiceOrbEl = document.querySelector("voice-orb");
        voiceOrbEl.setAttribute("size", cssPropSize("--diameter") * 1.25);
        voiceOrbEl.style.maxHeight = `${cssPropSize("--diameter") * 1.25}px`;

        browser.browserAction
            .setPopupStyles({
                minWidth: 0,
                minHeight: 0,
                backgroundColor: "transparent"
            });
        browser.browserAction.detachPopup();
        browser.browserAction.openPopup();

        window.resizePopup = function(isMax = false) {
            const currentSize = size[+isMax];

            setTimeout(() => {
                browser.browserAction
                    .resizePopup(currentSize[0], currentSize[1]);
            }, !isMax ? 300 : 0);
        }
        window.resizePopup();
    });