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


export function activateOrb(state, transitionTime = null) {
    document.body.setAttribute("data-speaking", state);

    document.querySelector("voice-orb")
        .update({
            ...ORB_CONFIG[state.toString()],
            ...transitionTime ? { transitionTime } : {}
        });
}