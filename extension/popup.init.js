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

        const size = {
            width: 2 * (cssPropSize("--inner-size") + 2 * cssPropSize("--outer-size")) + 3 * cssPropSize("--outer-size") + 10,
            height: (cssPropSize("--inner-size") + 2 * cssPropSize("--outer-size")) + 2 * cssPropSize("--outer-size")
        };

        document.querySelector("voice-orb")
            .setAttribute("size", ~~(cssPropSize("--inner-size") + 2 * cssPropSize("--outer-size")));

        browser.browserAction
            .setPopupStyles({
                minWidth: 0,
                minHeight: 0,
                borderRadius: `${size.height / 2}px`,
                border: "1px solid #e2e2e2ff",
                borderTopRightRadius: "10px"
            });
        browser.browserAction
            .resizePopup(size.width, size.height);
        browser.browserAction.detachPopup();
        browser.browserAction.openPopup();
    });