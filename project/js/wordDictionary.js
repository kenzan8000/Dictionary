(function(global) {

    /* **************************************************
     *                  WordDictionary
     ************************************************* */
    function WordDictionary() {
    };

    /// Member
    WordDictionary["prototype"]["searchWord"] = WordDictionary_searchWord;                      // WordDictionary#method(word:String):"found" or "failed" or jQuery.Deferred
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
        if (word == null) { return "failed"; }
        // word's length is more than 3?
        if (word.length < 3) { return "failed"; }
        // word is english?
        word = word.toLowerCase();
        if (!(/^[a-z]*$/).test(word)) { return "failed"; }
        // Lemmatize
//        var lemmatizer = new Lemmatizer();
//        word = lemmatizer.run(word);
        // undefined
        if (WordDictionary_isUndefinedWord(word)) { return "failed"; }
        // now searching
        if (word == WordDictionary_currentSearchWord) { return "failed"; }

        console.log(word);

        return "found";
/*
        // find from local
        var result = WordDictionary_findFromLocal(word);
        if (result != null) { return null; }

        // find from web api
        WordDictionary_setCurrentSearchWord(word);
        return WordDictionary_findFromWebAPI(word);
*/
    }

    function WordDictionary_setCurrentSearchWord(word) {
        WordDictionary_currentSearchWord = word;
    }

    function WordDictionary_setUndefinedWords(word) {
        WordDictionary_undefinedWords.push(word);
    }

    function WordDictionary_findFromLocal(word) {
/*
        for (var i = 0; i < WordDictionary_findedWords.length; i++) {
            var result = WordDictionary_findedWords[i];
            if (word == result["word"]) { return result; }
        }
        return null;
*/
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

})((this || 0).self || global);
