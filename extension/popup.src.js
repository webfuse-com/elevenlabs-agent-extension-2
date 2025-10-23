import { Conversation } from '@elevenlabs/client';


const CLIENT_TOOLS = {
    async take_dom_snapshot() {
        const fullSnapshot = await browser.webfuseSession
            .automation
            .take_dom_snapshot({
                modifier: {
                    name: 'D2Snap',
                    params: {
                        hierarchyRatio: 0, textRatio: 0, attributeRatio: 0,
                        assignUniqueIDs: true
                    }
                }
            });
        const finalSnapshot = ((fullSnapshot.length / 4) < 2**15)
            ? fullSnapshot
            : browser.webfuseSession
                .automation
                .take_dom_snapshot({
                    modifier: "downsample"
                });

		console.debug("Snapshot:", finalSnapshot);

		return finalSnapshot;
    },

    async take_gui_snapshot() {
        const fullSnapshot = await browser.webfuseSession
            .automation
            .take_dom_snapshot();
        const finalSnapshot = ((fullSnapshot.length / 4) < 2**15)
            ? fullSnapshot
            : browser.webfuseSession
                .automation
                .take_dom_snapshot({
                    modifier: "downsample"
                });

		console.debug("Snapshot:", finalSnapshot);

		return finalSnapshot;
    },

    async mouse_move({ x, y }) {
        return browser.webfuseSession
            .automation
            .mouse_move([ x, y ], true);
    },

    async scroll({ direction, amount, selector }) {
        return browser.webfuseSession
            .automation
            .scroll(direction, amount, selector, true);
    },

    async left_click({ selector }) {
        return browser.webfuseSession
            .automation
            .left_click(selector, true);
    },

    async right_click({ selector }) {
        return browser.webfuseSession
            .automation
            .right_click(selector, true);
    },

    async type({ text, selector }) {
        return browser.webfuseSession
            .automation
            .type(text, selector, true, true);
    },

    highlight({ selector }) {
        document.querySelector(selector)
            .style.backgroundColor = "yellow";
    },

    relocate({ url }) {
        browser.webfuseSession.relocate(url);
    },

    async get_current_location({}) {
        return await browser.tabs.sendMessage(0, { type: "location" });
    }
};

let deactivateOrbTimeout;
const CONVERSATION_HANDLERS = {
	onError(error) {
		console.error(error);
	},
	onConnect() {
		// ...
	},
	onMessage(message) {
        // ...
	},
    onModeChange(mode) {
        clearTimeout(deactivateOrbTimeout);

        switch(mode.mode) {
            case "speaking":
                activateOrb(true);
                break;
            default:
                deactivateOrbTimeout = setTimeout(() => activateOrb(false), 750);
                break;
        }
    },
};

const ORB_CONFIG = {
    false: {
        colors: [
            [255, 217, 130],
            [175, 137, 0],
            [255, 217, 130]
        ],
        transitionTime: 3000,
        morphSpeed: 0.25,
        randomness: 0.2,
        rotationSpeed: 0.075
    },
    true: {
        colors: [
            [255, 247, 212],
            [192, 127, 0],
            [255, 217, 90],
            [0, 200, 255]
        ],
        transitionTime: 1000,
        morphSpeed: 0.75,
        randomness: 0.9,
        rotationSpeed: 0.425
    }
};


function activateOrb(state, transitionTime = null) {
    document.body.setAttribute("data-speaking", state);

    document.querySelector("voice-orb")
        .update({
            ...ORB_CONFIG[state.toString()],
            ...transitionTime ? { transitionTime } : {}
        });
}


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


window.VoiceAgent = (() => {
	let conversation;
    let microphoneOn = false;

	return {
		async start() {
			conversation = await Conversation.startSession({
				agentId: browser.webfuseSession.env.AGENT_KEY,
				connectionType: "webrtc",
				clientTools: CLIENT_TOOLS,
				...CONVERSATION_HANDLERS
			});

            conversation.sendUserActivity();

			const microphoneOn = await browser.runtime.sendMessage({
				type: "microphone"
			});
			conversation.setMicMuted(!microphoneOn);
		},
		async stop() {
			if(!conversation) return;

			await conversation.endSession();
		},
        async toggleMicrophone() {
            if(!conversation) return;

            conversation.setMicMuted(microphoneOn);

            microphoneOn = !microphoneOn;

            document.body
                .setAttribute("data-microphone", microphoneOn.toString());
        }
	}
})();