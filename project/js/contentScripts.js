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
    WordDictionary["prototype"]["showBalloon"] = WordDictionary_showBalloon;        // WordDictionary#method(result:Dictionary, target:element, x:Int, y:Int):void

    WordDictionary["prototype"]["deferred"] = WordDictionary_deferred;              // WordDictionary#deferred:jQuery.Deferred
    WordDictionary["prototype"]["currentTarget"] = WordDictionary_currentTarget;    // WordDictionary#currentTarget:element
    WordDictionary["prototype"]["findedWords"] = WordDictionary_findedWords;        // WordDictionary#findedWords:Array

    /// Implementation
    var WordDictionary_deferred = null;
    var WordDictionary_currentTarget = null;
    var WordDictionary_findedWords = new Array();

    function WordDictionary_showWord(word, target, x, y) {
        // word is english?
        if (word == null) { return; }
        word = word.replace(/[^a-z]/g, '');
        if (word == "") { return; }
        if (!(/^[A-Za-z]*$/).test(word)) { return; }
        console.log(word);
var result = {
  "word": "reserve",
  "frequency": 4.26,
  "results": [
    {
      "definition": "give or assign a resource to a particular person or cause",
      "partOfSpeech": "verb",
      "synonyms": [
        "allow",
        "appropriate",
        "earmark",
        "set aside"
      ],
      "typeOf": [
        "assign",
        "portion",
        "allot"
      ]
    },
    {
      "definition": "something kept back or saved for future use or a special purpose",
      "partOfSpeech": "noun",
      "synonyms": [
        "backlog",
        "stockpile"
      ],
      "typeOf": [
        "accumulation"
      ],
      "hasTypes": [
        "bank",
        "reserve account",
        "fuel level",
        "reserve fund"
      ]
    },
    {
      "definition": "a district that is reserved for particular purpose",
      "partOfSpeech": "noun",
      "synonyms": [
        "reservation"
      ],
      "typeOf": [
        "territorial division",
        "administrative district",
        "administrative division"
      ],
      "hasTypes": [
        "indian reservation",
        "preserve"
      ]
    },
    {
      "definition": "the trait of being uncommunicative; not volunteering anything more than necessary",
      "partOfSpeech": "noun",
      "synonyms": [
        "reticence",
        "taciturnity"
      ],
      "typeOf": [
        "uncommunicativeness"
      ]
    },
    {
      "definition": "armed forces that are not on active duty but can be called in an emergency",
      "partOfSpeech": "noun",
      "synonyms": [
        "military reserve"
      ],
      "inCategory": [
        "war machine",
        "armed services",
        "military",
        "military machine",
        "armed forces"
      ],
      "typeOf": [
        "military machine",
        "armed forces",
        "armed services",
        "war machine",
        "military"
      ],
      "hasMembers": [
        "reservist"
      ],
      "derivation": [
        "reservist"
      ]
    },
    {
      "definition": "an athlete who plays only when a starter on the team is replaced",
      "partOfSpeech": "noun",
      "synonyms": [
        "second-stringer",
        "substitute"
      ],
      "typeOf": [
        "athlete",
        "jock"
      ],
      "hasTypes": [
        "bench warmer",
        "pinch hitter"
      ],
      "memberOf": [
        "bench"
      ]
    },
    {
      "definition": "formality and propriety of manner",
      "partOfSpeech": "noun",
      "synonyms": [
        "modesty"
      ],
      "typeOf": [
        "properness",
        "correctitude",
        "propriety"
      ],
      "hasTypes": [
        "demureness"
      ]
    },
    {
      "definition": "arrange for and reserve (something for someone else) in advance",
      "partOfSpeech": "verb",
      "synonyms": [
        "book",
        "hold"
      ],
      "entails": [
        "procure",
        "secure"
      ],
      "typeOf": [
        "bespeak",
        "request",
        "quest",
        "ask for",
        "call for"
      ],
      "hasTypes": [
        "hold open",
        "keep open",
        "save",
        "keep"
      ],
      "derivation": [
        "reservation"
      ],
      "examples": [
        "reserve me a seat on a flight"
      ]
    },
    {
      "definition": "hold back or set aside, especially for future use or contingency",
      "partOfSpeech": "verb",
      "typeOf": [
        "withhold",
        "keep back"
      ],
      "hasTypes": [
        "devote"
      ],
      "derivation": [
        "reservation"
      ]
    },
    {
      "definition": "(medicine) potential capacity to respond in order to maintain vital functions",
      "partOfSpeech": "noun",
      "inCategory": [
        "medicine",
        "medical specialty"
      ],
      "typeOf": [
        "indefinite quantity"
      ],
      "hasTypes": [
        "pulmonary reserve"
      ]
    },
    {
      "definition": "obtain or arrange (for oneself) in advance",
      "partOfSpeech": "verb",
      "typeOf": [
        "ask for",
        "request",
        "call for",
        "quest",
        "bespeak"
      ],
      "hasTypes": [
        "book up"
      ],
      "verbGroup": [
        "book",
        "hold"
      ],
      "derivation": [
        "reservation"
      ],
      "examples": [
        "We managed to reserve a table at Maxim's"
      ]
    }
  ],
  "syllables": {
    "count": 2,
    "list": [
      "re",
      "serve"
    ]
  },
  "pronunciation": {
    "all": "rɪ'zɜrv"
  }
};
        WordDictionary_showBalloon(result, target, x, y)
/*
        // find from local
        var result = WordDictionary_findFromLocal(word);
        if (result != null) {
            WordDictionary_showBalloon(result, target, x, y)
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

    function WordDictionary_showBalloon(result, target, x, y) {
        // parent dom
        var range = target.ownerDocument.createRange();
        range.selectNodeContents(target);
        WordDictionary_currentTarget = $(target);

        // calculate position
        var offset = WordDictionary_currentTarget.offset();
        range.selectNodeContents(target);
        var rect = range.getBoundingClientRect();
        offset.left = x - offset.left - rect.width / 2.0;
        offset.top = y - offset.top;

        // make HTML
        var HTMLString = "";
        var word = result["word"];
        var results = result["results"];
        var HTMLString = '<style type="text/css"> .kzn-dictionary { width: 256px; height: 128px; color: #000; background-color: #eee; font-size: 1.0em; font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif; line-height: 110%; word-break: break-all; overflow: auto; overflow-x: hidden; } .kzn-word { margin: 0.5em 0.5em; } .kzn-verb { color: #e74c3c; } .kzn-noun { color: #1abc9c; } .kzn-adverb { color: #9b59b6; } .kzn-preposition { color: #f1c40f; } .kzn-adjective { color: #e67e22; } .kzn-pronoun { color: #2ecc71; } .kzn-conjunction { color: #3498db; } .kzn-definition { color: #333; font-style: italic; } </style> <div class="kzn-dictionary"> ';
        for (var i = 0; i < results.length; i++) {
            HTMLString += '<p class="kzn-word"><strong>' + word + '</strong><span class="kzn-' + results[i]["partOfSpeech"] + '"> (' + results[i]["partOfSpeech"] + ') </span><span class="kzn-definition">' + results[i]["definition"] + "</span></p>";
        }
        HTMLString += '</div>'

        // show
        WordDictionary_currentTarget.showBalloon({
            contents: HTMLString,
            offsetX:offset.left, offsetY:offset.top,
            minLifetime: 0, showDuration: 0, hideDuration: 0
        });
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
                var newWord = cursor.getCurrentWord(event.target, event.pageX, event.pageY);

                if (currentWord != newWord) {
                    currentWord = newWord;
                    dictionary.hideWord();
                    dictionary.showWord(currentWord, event.target, event.pageX, event.pageY);
                }
            });
        }
    });

})((this || 0).self || global);
