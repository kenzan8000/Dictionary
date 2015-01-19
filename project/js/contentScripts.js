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
                WordDictionary_findedWords.push(data); // register the word on the local dictionary
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


    /* **************************************************
     *                  Cursor
     ************************************************* */
    function Cursor() {
    };

    /// Member
    Cursor["prototype"]["getCurrentWord"] = Cursor_getCurrentWord;         // Cursor#method(x:Int, y:Int):String or null

    /// Implementation
    function Cursor_getCurrentWord(element, x, y) {

        var range = document.caretRangeFromPoint(x, y);

        if (range != null &&
            range.startContainer.nodeType == range.startContainer.TEXT_NODE) {

            var textNode = range.startContainer;
            var start = range.startOffset;
            var end = start;
            while (start > 0) {
                start -= 1;
                range.setStart(textNode, start);
                if (/^\s/.test(range.toString())) {
                    range.setStart(textNode, start += 1);
                    break;
                }
            }
            var length = textNode.nodeValue.length;
            while (end < length) {
                end += 1;
                range.setEnd(textNode, end);
                if (/\s$/.test(range.toString())) {
                    range.setEnd(textNode, end -= 1);
                    break;
                }
            }
            window.getSelection().addRange(range);
        }
        else {
            if (element.childNodes == undefined || element.childNodes == null) { return ""; }

            var length = element.childNodes.length;
            for(var i = 0; i < length; i++) {
                range = element.childNodes[i].ownerDocument.createRange();
                range.selectNodeContents(element.childNodes[i]);

                var offset = $(element.childNodes[i]).offset();
                var rect = range.getBoundingClientRect();
                if (offset.left + rect.left <= x && offset.left + rect.right >= x && offset.top + rect.top <= y && offset.top + rect.bottom >= y) {
                    range.detach();
                    return(Cursor_getCurrentWord(element.childNodes[i], x, y));
                }
                else {
                    range.detach();
                }
            }
        }

        if (range == null) { return ""; }
        return range.toString();
    }

    /// Exports
    if ("process" in global) {
        module["exports"] = Cursor;
    }
    global["Cursor"] = Cursor;


    var cursor = new Cursor();
    //var dictionary = new WordDictionary();
    var currentTarget = null;
    var currentWord = null;
    //dictionary.showWord("apple");

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.message == "Dictionary-On-Google-Chrome-Extension") {
            $('body').mousemove(function(event) {
                var previousTarget = currentTarget;
                var previousWord = currentWord;
                currentTarget = event.target;
                currentWord = cursor.getCurrentWord(currentTarget, event.pageX, event.pageY);

                var cursorIsMoved = (currentTarget != previousTarget) || (currentWord != previousWord);
                if (cursorIsMoved) { console.log(currentWord); }
            });
        }
    });

})((this || 0).self || global);

/*
                    $(currentTarget).balloon({
                        minLifetime: 0, showDuration: 0, hideDuration: 0
                    });
*/
