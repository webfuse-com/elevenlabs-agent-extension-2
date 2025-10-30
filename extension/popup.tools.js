export const CLIENT_TOOLS = {
    async take_dom_snapshot() {
        const fullSnapshot = await browser.webfuseSession
            .automation
            .take_dom_snapshot({
                rootSelector: "body",
                modifier: {
                    name: 'D2Snap',
                    params: {
                        hierarchyRatio: 0, textRatio: 0, attributeRatio: 0,
                        options: {
                            assignUniqueIDs: true,
                            keepUnknownElements: true
                        }

                    }
                }
            });
        const finalSnapshot = ((fullSnapshot.length / 4) < 2**13.97)
            ? fullSnapshot
            : browser.webfuseSession
                .automation
                .take_dom_snapshot({
                    rootSelector: "body",
                    modifier: "downsample"
                });

		console.debug("Snapshot:", finalSnapshot);

		return finalSnapshot;
    },

    /* async take_gui_snapshot() {
		const imageBitmap = await browser.webfuseSession
            .automation
            .take_gui_snapshot();

        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(imageBitmap, 0, 0);

        return canvas
            .toDataURL(type, quality)
            .split(",")[1];
    }, */

    async mouse_move({ x, y }) {
		console.debug("[mouse_move] CSS selector:", selector);

        return browser.webfuseSession
            .automation
            .mouse_move([ x, y ], true);
    },

    async scroll({ direction, amount, selector }) {
		console.debug("[scroll] CSS selector:", selector);

        return browser.webfuseSession
            .automation
            .scroll(selector, direction, amount, true);
    },

    async left_click({ selector }) {
		console.debug("[left_click] CSS selector:", selector);

        return browser.webfuseSession
            .automation
            .left_click(selector, true);
    },

    async right_click({ selector }) {
		console.debug("[right_click] CSS selector:", selector);

        return browser.webfuseSession
            .automation
            .right_click(selector, true);
    },

    async type({ text, selector }) {
		console.debug("[type] CSS selector:", selector);

        return browser.webfuseSession
            .automation
            .type(selector, text, true, true);
    },

    highlight({ selector }) {
		console.debug("[highlight] CSS selector:", selector);

        const highlightEl = document.querySelector(selector);

        highlightEl.style.backgroundColor = "yellow !important";
        highlightEl.style.transform = "scale(1.05) !important";
    },

    relocate({ url }) {
        browser.webfuseSession.relocate(url);
    },

    async get_current_location({}) {
        return await browser.tabs.sendMessage(0, { type: "location" });
    }
};
