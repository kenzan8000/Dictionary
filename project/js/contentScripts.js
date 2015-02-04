(function(global) {
    "use strict;"

    var cursor = new Cursor();
    var dictionary = new WordDictionary();
    var currentWord = null;

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.message == "Dictionary-On-Google-Chrome-Extension") {

            $(document.body).mousemove(function(event) {
                var isFocused = cursor.isFocusedOnWord(event.target, event.pageX, event.pageY);

                if (isFocused) {
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
        }
    });

})((this || 0).self || global);
