const ORB_CONFIG = {
    false: {
        colors: [
            [255, 255, 255],
            [117, 139, 253]
        ],
        transitionTime: 500,
        morphSpeed: 0.15,
        randomness: 0.2,
        rotationSpeed: 0.05
    },
    true: {
        colors: [
            [117, 139, 253],
            [186, 243, 236],
            [91, 93, 245],
        ],
        transitionTime: 2000,
        morphSpeed: 0.9,
        randomness: 0.9,
        rotationSpeed: 0.7
    }
};


export function activateOrb(state, transitionTime = null) {
    document.body.setAttribute("data-speaking", state);

    document.querySelector("voice-orb")
        .update({
            ...ORB_CONFIG[state.toString()],
            ...transitionTime ? { transitionTime } : {}
        });
}