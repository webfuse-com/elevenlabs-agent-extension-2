browser.runtime.onMessage
    .addListener(message => {
        switch(message.type) {
            case "location":
                return document.location.href;
        }
    });