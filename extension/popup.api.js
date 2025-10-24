import { Conversation } from "@elevenlabs/client";

import { CLIENT_TOOLS } from "./popup.tools.js";
import { activateOrb } from "./popup.orb.js";


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