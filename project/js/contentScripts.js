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
     *                  CursorWord
     ************************************************* */
    function CursorWord() {
    };

    /// Member
    CursorWord["prototype"]["getCurrentWord"] = CursorWord_getCurrentWord;         // CursorWord#method(x:Int, y:Int):String or null

    /// Implementation
    function CursorWord_getCurrentWord(x, y) {
        if (!(document.caretRangeFromPoint)) { return null; }
/*
        var range = document.caretRangeFromPoint(x, y);
        var textNode = range.startContainer; // should be a text node
        console.log("1" + textNode + "\n\n\n" + textNode.nodeValue);
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

        return range.toString();
*/
        return null;
    }

    /// Exports
    if ("process" in global) {
        module["exports"] = CursorWord;
    }
    global["CursorWord"] = CursorWord;


    var cursorWord = new CursorWord();
    //var dictionary = new WordDictionary();
    //dictionary.showWord("apple");

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
                    console.log(cursorWord.getCurrentWord(currentMousePosition.x, currentMousePosition.y));
                    //console.log("previous:" + previousTarget + "\ncurrent:" + currentTarget);
                }
            });
        }
    });

})((this || 0).self || global);

