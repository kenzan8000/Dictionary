(function(global) {
    "use strict;"


    // dictionary
    var cursor = new Cursor();
    var dictionary = new WordDictionary();
    var currentWord = null;
    var dictionaryIsOn = false;
    chrome.storage.local.get("iconIsOn", function(storage) {
        dictionaryIsOn = storage.iconIsOn;
    });

    $(document.body).mousemove(function(event) {
        if (dictionaryIsOn == "false") { cursor.hideBalloon(); return; }
        if (cursor.isFocusedOnBalloon()) { return; }

        var wordIsFocused = cursor.isFocusedOnWord(event.target, event.pageX, event.pageY);

        if (wordIsFocused) {
            var newWord = cursor.getWord();

            if (newWord != currentWord) {
                currentWord = newWord;

                var deferred = dictionary.searchWord(currentWord);
                // search from local dictionary
                if (deferred == "found") {
                    var definitions = dictionary.findFromLocal(currentWord);
                    if (definitions != null) { cursor.showBalloon(definitions); }
                }
                // search from web api
                else if (deferred != "failed") {
                    deferred
                        .fail(function() {
                            dictionary.setUndefinedWords(currentWord); // register the word that might not be English
                            dictionary.setCurrentSearchWord("");
                        })
                        .done(function() {
                            dictionary.setCurrentSearchWord("");
                            var definitions = dictionary.findFromLocal(currentWord);
                            if (definitions != null) { cursor.showBalloon(definitions); }
                        });
                }
            }
        }
        else {
            cursor.hideBalloon();
        }
    });


    // chrome
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.message == "dictionaryStateDidChange") {
            cursor.hideBalloon();
            chrome.storage.local.get("iconIsOn", function(storage) {
                dictionaryIsOn = storage.iconIsOn;
            });
        }
    });

})((this || 0).self || global);
