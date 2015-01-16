(function(global) {
    "use strict;"

    /* **************************************************
     *                  WordDictionary
     ************************************************* */
    function WordDictionary() {
    };

    /// Member
    WordDictionary["prototype"]["showWord"] = WordDictionary_showWord;              // WordDictionary#method(word:String):void
    WordDictionary["prototype"]["findFromLocal"] = WordDictionary_findFromLocal;    // WordDictionary#method(word:String):word JSON or null
    WordDictionary["prototype"]["findFromWebAPI"] = WordDictionary_findFromWebAPI;  // WordDictionary#method(word:String):jQuery.Deferred.promise
    WordDictionary["prototype"]["stopFind"] = WordDictionary_stopFind;              // WordDictionary#method():void

    WordDictionary["prototype"]["deferred"] = WordDictionary_deferred;              // WordDictionary#deferred:jQuery.Deferred
    WordDictionary["prototype"]["findedWords"] = WordDictionary_findedWords;        // WordDictionary#findedWords:Array


    /// Implementation
    var WordDictionary_deferred = null;
    var WordDictionary_findedWords = new Array();

    function WordDictionary_showWord(word) {
        // find from local
        var result = WordDictionary_findFromLocal(word);
        if (result != null) { return; }

        // find from web api
        WordDictionary_findFromWebAPI(word)
            .fail(function() {
            })
            .done(function() {
                WordDictionary_showWord(word);
            });
    }

    function WordDictionary_findFromLocal(word) {
        for (var i = 0; i < WordDictionary_findedWords.length; i++) {
            var result = WordDictionary_findedWords[i];
            if (word == result["word"]) { return result; }
        }
        return null;
    }

    function WordDictionary_findFromWebAPI(word) {
        if (WordDictionary_deferred != null) { WordDictionary_stopFind(); }
        WordDictionary_deferred = jQuery.Deferred();

        // API
        var API_URL = "https://www.wordsapi.com/words/" + word + "?accessToken=aYmh27eVOBWPZepqICu6nVXdwM";

        // ajax
        jQuery.ajax({
            type: "GET",
            url: API_URL,
            success: function(data, status, xhr) {
                console.log(data);
                WordDictionary_findedWords.push(data);
                WordDictionary_deferred.resolve();
            },
            error: function(xhr, exception) {
                WordDictionary_deferred.reject();
            }
        });
        return WordDictionary_deferred.promise();
    }

    function WordDictionary_stopFind() {
        if (WordDictionary_deferred != null) {
            WordDictionary_deferred.reject();
        }
    }

    /// Exports
    if ("process" in global) {
        module["exports"] = WordDictionary;
    }
    global["WordDictionary"] = WordDictionary;


    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        var dictionary = new WordDictionary();
        dictionary.showWord("apple");

        if (request.message == "Dictionary-On-Google-Chrome-Extension") {
/*
            var currentMousePosition = { x: -1, y: -1 };
            var currentTarget = null;

            $('body').mousemove(function(event) {
                currentMousePosition.x = event.pageX;
                currentMousePosition.y = event.pageY;

                var previousTarget = currentTarget;
                currentTarget = event.target;
                if (previousTarget != currentTarget) {
                    $(currentTarget).balloon({
                        minLifetime: 0, showDuration: 0, hideDuration: 0
                    });
                    //console.log("previous:" + previousTarget + "\ncurrent:" + currentTarget);
                }
            });
*/
        }
    });

})((this || 0).self || global);

