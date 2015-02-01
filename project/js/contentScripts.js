(function(global) {
    "use strict;"

    /* **************************************************
     *                  WordDictionary
     ************************************************* */
    function WordDictionary() {
    };

    /// Member
    WordDictionary["prototype"]["searchWord"] = WordDictionary_searchWord;                      // WordDictionary#method(word:String):null or undefined or deferred
    WordDictionary["prototype"]["setCurrentSearchWord"] = WordDictionary_setCurrentSearchWord;  // WordDictionary#method(word:String):void
    WordDictionary["prototype"]["setUndefinedWords"] = WordDictionary_setUndefinedWords;        // WordDictionary#method(word:String):void
    WordDictionary["prototype"]["findFromLocal"] = WordDictionary_findFromLocal;                // WordDictionary#method(word:String):definitions

    var WordDictionary_deferred = null;
    var WordDictionary_findedWords = new Array();
    var WordDictionary_undefinedWords = new Array();
    var WordDictionary_currentSearchWord = "";

    /// Implementation
    function WordDictionary_searchWord(word) {
        // word is string?
        if (word == null) { return undefined; }
        // word's length is more than 3?
        if (word.length < 3) { return undefined; }
        // word is english?
        word = word.toLowerCase();
        word = word.replace(/[^a-z]/g, '');
        if (word == "") { return undefined; }
        if (!(/^[A-Za-z]*$/).test(word)) { return undefined; }
        // undefined
        if (WordDictionary_isUndefinedWord(word)) { return undefined; }
        // now searching
        if (word == WordDictionary_currentSearchWord) { return undefined; }

//        return null;
        // find from local
        var result = WordDictionary_findFromLocal(word);
        if (result != null) { return null; }

        // find from web api
        WordDictionary_setCurrentSearchWord(word);
        return WordDictionary_findFromWebAPI(word);
    }

    function WordDictionary_setCurrentSearchWord(word) {
        WordDictionary_currentSearchWord = word;
    }

    function WordDictionary_setUndefinedWords(word) {
        WordDictionary_undefinedWords.push(word);
    }

    function WordDictionary_findFromLocal(word) {
        for (var i = 0; i < WordDictionary_findedWords.length; i++) {
            var result = WordDictionary_findedWords[i];
            if (word == result["word"]) { return result; }
        }
        return null;
/*
        var result = {
          "word": "example",
          "definitions": [
            {
              "definition": "a representative form or pattern",
              "partOfSpeech": "noun"
            },
            {
              "definition": "something to be imitated",
              "partOfSpeech": "noun"
            },
            {
              "definition": "an occurrence of something",
              "partOfSpeech": "noun"
            },
            {
              "definition": "an item of information that is typical of a class or group",
              "partOfSpeech": "noun"
            },
            {
              "definition": "punishment intended as a warning to others",
              "partOfSpeech": "noun"
            },
            {
              "definition": "a task performed or problem solved in order to develop skill or understanding",
              "partOfSpeech": "noun"
            }
          ]
        };
        return result;
*/
    }

    function WordDictionary_findFromWebAPI(word) {
        if (WordDictionary_deferred != null) { WordDictionary_stopFinding(); }
        WordDictionary_deferred = jQuery.Deferred();

        // API
        var API_URL = "https://www.wordsapi.com/words/" + word + "/definitions?accessToken=aYmh27eVOBWPZepqICu6nVXdwM";

        // ajax
        jQuery.ajax({
            type: "GET",
            url: API_URL,
            success: function(data, status, xhr) {
                data["word"] = word;
                WordDictionary_findedWords.push(data); // register the word on the local dictionary
                WordDictionary_deferred.resolve();
            },
            error: function(xhr, exception) {
                WordDictionary_deferred.reject();
            }
        });

        return WordDictionary_deferred.promise();
    }

    function WordDictionary_isUndefinedWord(word) {
        for (var i = 0; i < WordDictionary_undefinedWords.length; i++) {
            if (word == WordDictionary_undefinedWords[i]) { return true; }
        }
        return false;
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
    Cursor["prototype"]["isFocusedOnWord"] = Cursor_isFocusedOnWord;         // Cursor#method(element:event.target, x:Int, y:Int):true or false
    Cursor["prototype"]["getWord"] = Cursor_getWord;                         // Cursor#method():String
    Cursor["prototype"]["showBalloon"] = Cursor_showBalloon;                 // Cursor#method(result:Dictionary, element:event.target):void
    Cursor["prototype"]["hideBalloon"] = Cursor_hideBalloon;                 // Cursor#method():void

    var Cursor_word = "";
    var Cursor_wordRect = null;

    /// Implementation
    function Cursor_isFocusedOnWord(element, x, y) {
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
                    Cursor_word = range.toString();
                    Cursor_wordRect = {left:rect.left, right:rect.right, top:rect.top, bottom:rect.bottom};
                    range.detach();
                    return true;
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
                    return Cursor_isFocusedOnWord(element.childNodes[i], x, y);
                }
                else {
                    range.detach();
                }
            }
        }
        return false;
    }

    function Cursor_getWord() {
        return Cursor_word;
    }

    function Cursor_showBalloon(result) {
        Cursor_hideBalloon();

        // make HTML
        var HTMLString = "";
        var word = result["word"];
        var results = result["definitions"];
        var HTMLString = '<style type="text/css"> .kzn-dictionary { width: 256px; height: 96px; color: #000; background-color: #eee; font-size: 1.0em; font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif; line-height: 110%; word-break: break-all; overflow: auto; overflow-x: hidden; } .kzn-word { margin: 0.5em 0.5em; } .kzn-verb { color: #e74c3c; } .kzn-noun { color: #1abc9c; } .kzn-adverb { color: #9b59b6; } .kzn-preposition { color: #f1c40f; } .kzn-adjective { color: #e67e22; } .kzn-pronoun { color: #2ecc71; } .kzn-conjunction { color: #3498db; } .kzn-definition { color: #333; font-style: italic; } </style> <div class="kzn-dictionary"> ';
        for (var i = 0; i < results.length; i++) {
            HTMLString += '<p class="kzn-word"><strong>' + word + '</strong><span class="kzn-' + results[i]["partOfSpeech"] + '"> (' + results[i]["partOfSpeech"] + ') </span><span class="kzn-definition">' + results[i]["definition"] + "</span></p>";
        }
        HTMLString += '</div>'

        var topOffset = $(window).scrollTop();
        var leftOffset = $(window).scrollLeft();
        // show
        $(document.body).showBalloon({
            contents: HTMLString,
            offsetX:leftOffset + Cursor_wordRect.left - document.body.clientWidth/2.0, offsetY:- topOffset - Cursor_wordRect.top,
            minLifetime: 0, showDuration: 0, hideDuration: 0,
            tipSize: 0
        });
    }

    function Cursor_hideBalloon() {
        $(document.body).hideBalloon();
    }

    /// Exports
    if ("process" in global) {
        module["exports"] = Cursor;
    }
    global["Cursor"] = Cursor;


    /* **************************************************
     *               Chrome Extension
     ************************************************* */
    var cursor = new Cursor();
    var dictionary = new WordDictionary();
    var currentWord = null;

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.message == "Dictionary-On-Google-Chrome-Extension") {
            $('body').mousemove(function(event) {
                var isFocused = cursor.isFocusedOnWord(event.target, event.pageX, event.pageY);

                if (isFocused) {
                    var newWord = cursor.getWord();

                    if (newWord != currentWord) {
                        currentWord = newWord;

                        var deferred = dictionary.searchWord(currentWord);
                        // search from local dictionary
                        if (deferred == null) {
                            var definitions = dictionary.findFromLocal(currentWord);
                            if (definitions != null) { cursor.showBalloon(definitions); }
                        }
                        // search from web api
                        else if (deferred != undefined) {
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
