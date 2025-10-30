import { Conversation } from "@elevenlabs/client";

import { CLIENT_TOOLS } from "./popup.tools.js";
import { activateOrb } from "./popup.orb.js";


const AI_TYPE_SPEED_PER_CHAR_MS = 10;


let lastAIMessage = "";

function typeMessage(messageEl, remainingMessage, speed) {
	if(!remainingMessage.trim()) return;

	messageEl.textContent += remainingMessage[0];

	const messagesEl = document.querySelector("#messages");
	messagesEl.scrollTo({
		top: messagesEl.scrollHeight
	});

	setTimeout(() => {
		typeMessage(messageEl, remainingMessage.slice(1), speed);
	}, Math.random() * (speed / 2) + (speed / 2));
}

function printConversationMessage(source, message) {
	message = message.trim();
	if(!message || message === "...") return;	// user idle

	const messageEl = document.createElement("SPAN");
	messageEl.classList.add("message");
	messageEl.classList.add(`message--${source}`);

	const isAIMessage = (source === "ai");

	if(isAIMessage && (message === lastAIMessage)) return;

	typeMessage(messageEl, message, isAIMessage ? AI_TYPE_SPEED_PER_CHAR_MS : 0);

	lastAIMessage = isAIMessage ? message : lastAIMessage;

	document.querySelector("#messages")
		.appendChild(messageEl);
}


let deactivateOrbTimeout;

const CONVERSATION_HANDLERS = {
	onError(error) {
		console.error(error);
	},

	onConnect() {
		document.body.setAttribute("data-connected", "");
	},

	onDisconnect() {
		document.body.removeAttribute("data-connected");

		printConversationMessage("ai", "CONVERSATION TERMINATED");
	},

	onMessage(message) {
		printConversationMessage(message.source, message.message);

		console.debug(message);
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
	let keyboardOn = false;

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
        },

        async toggleKeyboard() {
            if(!conversation) return;

            keyboardOn = !keyboardOn;

        	try { window.resizePopup(keyboardOn); } catch { /* */}

            document.body
                .setAttribute("data-keyboard", keyboardOn.toString());
        },

        async submitMessage(message) {
            if(!conversation) return;

            message = message.trim();

			conversation.sendUserMessage(message);

			printConversationMessage("user", message);

			if(!message) return;
        }
	}
})();