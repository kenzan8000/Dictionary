(function(global) {
    "use strict;"

    chrome.browserAction.onClicked.addListener(function() {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
            chrome.tabs.sendRequest(tabs[0].id, {message: "Dictionary-On-Google-Chrome-Extension"}, function(response) {
            });
        });
    });

})((this || 0).self || global);
