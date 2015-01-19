(function(global) {
    "use strict;"

    /* **************************************************
     *                  WordDictionary
     ************************************************* */
    function WordDictionary() {
    };

    /// Member
    WordDictionary["prototype"]["showWord"] = WordDictionary_showWord;              // WordDictionary#method(word:String, target:element, x:Int, y:Int):void
    WordDictionary["prototype"]["hideWord"] = WordDictionary_hideWord;              // WordDictionary#method():void
    WordDictionary["prototype"]["findFromLocal"] = WordDictionary_findFromLocal;    // WordDictionary#method(word:String):word JSON or null
    WordDictionary["prototype"]["findFromWebAPI"] = WordDictionary_findFromWebAPI;  // WordDictionary#method(word:String):jQuery.Deferred.promise
    WordDictionary["prototype"]["stopFinding"] = WordDictionary_stopFinding;        // WordDictionary#method():void

    WordDictionary["prototype"]["deferred"] = WordDictionary_deferred;              // WordDictionary#deferred:jQuery.Deferred
    WordDictionary["prototype"]["currentTarget"] = WordDictionary_currentTarget;    // WordDictionary#currentTarget:element
    WordDictionary["prototype"]["findedWords"] = WordDictionary_findedWords;        // WordDictionary#findedWords:Array

    /// Implementation
    var WordDictionary_deferred = null;
    var WordDictionary_currentTarget = null;
    var WordDictionary_findedWords = new Array();

    function WordDictionary_showWord(word, target, x, y) {
        if (word == null || word == "") { return; }
        if (!(/^[A-Za-z]*$/.test(word))) { return; } // word is english?
/*
        console.log(word);

        // show balloon
        var range = target.ownerDocument.createRange();
        range.selectNodeContents(target);
        WordDictionary_currentTarget = $(target);
        var offset = WordDictionary_currentTarget.offset();
        range.selectNodeContents(target);
        var rect = range.getBoundingClientRect();
        offset.left = x - (rect.left + offset.left);
        offset.top = y - (rect.top + offset.top);
        console.log("offsetX:" + offset.left + "offsetY:" + offset.top);
        WordDictionary_currentTarget.showBalloon({
            contents: word,
            offsetX:offset.left, offsetY:offset.top,
            position: "left top",
            minLifetime: 0, showDuration: 0, hideDuration: 0
        });
*/
/*
        // find from local
        var result = WordDictionary_findFromLocal(word);
        if (result != null) {
        }

        // find from web api
        WordDictionary_findFromWebAPI(word)
            .fail(function() {
            })
            .done(function() {
                WordDictionary_showWord(word, target, x, y); // find the word from the local dictionary
            });
*/
    }

    function WordDictionary_hideWord() {
        if (WordDictionary_currentTarget) {
            WordDictionary_currentTarget.hideBalloon();
            WordDictionary_currentTarget = null;
        }
    }

    function WordDictionary_findFromLocal(word) {
        for (var i = 0; i < WordDictionary_findedWords.length; i++) {
            var result = WordDictionary_findedWords[i];
            if (word == result["word"]) { return result; }
        }
        return null;
    }

    function WordDictionary_findFromWebAPI(word) {
        if (WordDictionary_deferred != null) { WordDictionary_stopFinding(); }
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

    function WordDictionary_stopFinding() {
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
    Cursor["prototype"]["getCurrentWord"] = Cursor_getCurrentWord;         // Cursor#method(element:event.target, x:Int, y:Int):String or null

    /// Implementation
    function Cursor_getCurrentWord(element, x, y) {
        if (element.nodeType == element.TEXT_NODE) {
            var range = element.ownerDocument.createRange();
            range.selectNodeContents(element);
            var currentPos = 0;
            var endPos = range.endOffset;
            while(currentPos+1 < endPos) {
                range.setStart(element, currentPos);
                range.setEnd(element, currentPos+1);
                var offset = $(element).offset();
                var rect = range.getBoundingClientRect();

                if(offset.left + rect.left <= x && offset.left + rect.right  >= x &&
                   offset.top  + rect.top  <= y && offset.top  + rect.bottom >= y) {
                    range.expand("word");
                    var word = range.toString();
                    range.detach();
                    return word;
                }
                currentPos += 1;
            }
        }
        else {
            for(var i = 0; i < element.childNodes.length; i++) {
                var offset = $(element.childNodes[i]).offset();
                var range = element.childNodes[i].ownerDocument.createRange();
                range.selectNodeContents(element.childNodes[i]);
                var rect = range.getBoundingClientRect();
                if(offset.left + rect.left <= x && offset.left + rect.right  >= x &&
                   offset.top  + rect.top  <= y && offset.top  + rect.bottom >= y) {
                    range.detach();
                    return Cursor_getCurrentWord(element.childNodes[i], x, y);
                }
                else {
                    range.detach();
                }
            }
        }
        return null;
    }

    /// Exports
    if ("process" in global) {
        module["exports"] = Cursor;
    }
    global["Cursor"] = Cursor;


    var cursor = new Cursor();
    var dictionary = new WordDictionary();
    var currentWord = null;

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.message == "Dictionary-On-Google-Chrome-Extension") {
            $('body').mousemove(function(event) {
                var previousWord = currentWord;
                currentWord = cursor.getCurrentWord(event.target, event.pageX, event.pageY);

                var cursorIsMoved = (currentWord != previousWord);
                if (cursorIsMoved) {
                    dictionary.hideWord();
                    dictionary.showWord(currentWord, event.target, event.pageX, event.pageY);
                }
            });
        }
    });

})((this || 0).self || global);
