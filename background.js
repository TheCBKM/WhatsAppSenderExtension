chrome.runtime.onInstalled.addListener(async function(details) {
    await showWhatsappTab();
    var notifOptions = {
        type: "basic",
        iconUrl: "img/icon128.png",
        title: "WASender Installation Finished.",
        message: "Click on WA Icon above"
    };
    chrome.notifications.create(notifOptions, function(notificationID) {
        console.log(notificationID, "notif created", chrome.runtime.lastError)
    })
});
chrome.runtime.onMessage.addListener(async function(msg, sender) {
    console.log('onMessage');
    if (msg.subject === MSG_GET_REF_COOKIE) {
        const refid = await getRefCookie();
        sendMsgToExtension({
            from: "background.js",
            subject: MSG_REF_COOKIE_VALUE,
            data: refid
        })
    }
    if (msg.subject === MSG_SHOW_WHATSAPP_TAB) {
        showWhatsappTab(false)
    }
});
async function showWhatsappTab(reload = true) {
    console.log('showWhatsappTab');
    console.log('chrome.tabs:', chrome.tabs);
    chrome.tabs.getAllInWindow(null, function(tabs) {
        console.log('Tabs:', tabs);
        const whatsappTab = tabs.find(tab => tab.url === "https://web.whatsapp.com" || tab.url === "https://web.whatsapp.com/");
        console.log('whatsappTab', whatsappTab);
        if (whatsappTab) {
            chrome.tabs.update(whatsappTab.id, {
                active: true
            }, function(tab) {
                console.log("Error this")
            });
            if (reload) {
                setTimeout(function() {
                    chrome.tabs.reload(whatsappTab.id)
                }, 500)
            }
        } else {
            const newURL = "https://web.whatsapp.com";
            chrome.tabs.create({
                url: newURL
            })
        }
    })
}