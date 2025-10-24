export const CLIENT_TOOLS = {
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