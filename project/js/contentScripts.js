(function(global) {
    "use strict;"

    /* **************************************************
     *                  WordDictionary
     ************************************************* */
    function WordDictionary() {
    };

    /// Member
    WordDictionary["prototype"]["searchWord"] = WordDictionary_searchWord; // WordDictionary#method(word:String):jQuery.Deferred.promise
    WordDictionary["prototype"]["stopSearch"] = WordDictionary_stopSearch; // WordDictionary#method():void

    WordDictionary["prototype"]["deferred"] = WordDictionary_deferred; // WordDictionary#deferred:jQuery.Deferred

    /// Implementation
    var WordDictionary_deferred = null;

    function WordDictionary_searchWord(word) {
        // API
        var API_URL = "https://www.wordsapi.com/words/" + word + "?accessToken=aYmh27eVOBWPZepqICu6nVXdwM";

        // ajax
        WordDictionary_deferred = jQuery.Deferred();
        jQuery.ajax({
            type: "GET",
            url: API_URL,
            success: function(data, status, xhr) {
                WordDictionary_deferred.resolve();
            },
            error: function(xhr, exception) {
                WordDictionary_deferred.reject();
            }
        });
        return WordDictionary_deferred.promise();
    }

    function WordDictionary_stopSearch() {
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
        if (request.message == "Dictionary-On-Google-Chrome-Extension") {

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
                    console.log("previous:" + previousTarget + "\ncurrent:" + currentTarget);
/*
                    var dictionary = WordDictionary();
                    dictionary.searchWord("hoge")
                        .fail(function() {
                        })
                        .done(function() {
                        });
*/
                }
            });

        }
    });

})((this || 0).self || global);

