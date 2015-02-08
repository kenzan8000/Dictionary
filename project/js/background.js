(function(global) {
    "use strict;"


    // icon
    chrome.storage.local.get({"iconIsOn":"false"}, function(storage) {
        var imagePath = (storage.iconIsOn == "true") ? "images/icon19.png" : "images/icon19_off.png";
        chrome.browserAction.setIcon({path:imagePath});
        console.log("initial:"+imagePath);
        chrome.tabs.sendRequest(tabs[0].id, {message: "dictionaryStateDidChange"}, function(response) {
        });
    });


    // chrome
    chrome.browserAction.onClicked.addListener(function() {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
            chrome.storage.local.get("iconIsOn", function(storage) {
                var iconIsOn = (storage.iconIsOn == "true") ? "false" : "true";
                chrome.storage.local.set({"iconIsOn":iconIsOn}, function() {
                    var imagePath = (iconIsOn == "true") ? "images/icon19.png" : "images/icon19_off.png";
                    chrome.browserAction.setIcon({path:imagePath});
                    console.log("hoge:"+imagePath);
                    chrome.tabs.sendRequest(tabs[0].id, {message: "dictionaryStateDidChange"}, function(response) {
                    });
                });
            });
        });
    });

})((this || 0).self || global);
