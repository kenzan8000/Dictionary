(function(global) {

    /* **************************************************
     *                  WordDictionary
     ************************************************* */
    function WordDictionary() {
        this.deferred = null;
        this.findedWords = new Array();
        this.undefinedWords = new Array();
        this.currentSearchWord = "";
        this.mashapeKey = "";

        var _this = this;
        jQuery.ajax({
            type: "GET",
            url: chrome.extension.getURL("jsons/settings.json"),
            success: function(data, status, xhr) {
                var json = JSON.parse(xhr.responseText);
                _this.mashapeKey = json["X-Mashape-Key"];
            },
            error: function(xhr, exception) {
            }
        });
    };

    /// Implementation
    WordDictionary.prototype.lemmetize = function(word) {
        var newWord = word;
        // word is string?
        if (newWord == null) { return null; }
        // word's length is more than 3?
        if (newWord.length < 3) { return null; }
        // word is english?
        newWord = newWord.toLowerCase();
        if (!(/^[a-z]*$/).test(newWord)) { return null; }
        // Lemmatize
        var lemmatizer = new Lemmatizer();
        newWord = (lemmatizer.only_lemmas(newWord))[0];
        return newWord;
    }

    WordDictionary.prototype.searchWord = function(word) {
        // word is string?
        if (word == null) { return "failed"; }
/*
        // word's length is more than 3?
        if (word.length < 3) { return "failed"; }
        // word is english?
        word = word.toLowerCase();
        if (!(/^[a-z]*$/).test(word)) { return "failed"; }
        // Lemmatize
        var lemmatizer = new Lemmatizer();
        word = (lemmatizer.only_lemmas(word))[0];
*/
        // undefined
        if (this.isUndefinedWord(word)) { return "failed"; }
        // now searching
        if (word == this.currentSearchWord) { return "failed"; }
/*
        console.log(word);
        return "found";
*/
        // find from local
        var result = this.findFromLocal(word);
        if (result != null) { return "found"; }

        // find from web api
        this.setCurrentSearchWord(word);
        return this.findFromWebAPI(word);
    }

    WordDictionary.prototype.setCurrentSearchWord = function(word) {
        this.currentSearchWord = word;
    }

    WordDictionary.prototype.setUndefinedWords = function(word) {
        this.undefinedWords.push(word);
    }

    WordDictionary.prototype.findFromLocal = function(word) {
        for (var i = 0; i < this.findedWords.length; i++) {
            var result = this.findedWords[i];
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

    WordDictionary.prototype.findFromWebAPI = function(word) {
        if (this.deferred != null) { this.stopFinding(); }
        this.deferred = jQuery.Deferred();

        // API
        var API_URL = "https://wordsapiv1.p.mashape.com/words/" + word + "/definitions";

        // ajax
        var _this = this;
        jQuery.ajax({
            type: "GET",
            url: API_URL,
            beforeSend: function(xhr){
                xhr.setRequestHeader("X-Mashape-Key", _this.mashapeKey);
                xhr.setRequestHeader("Accept", "application/json");
            },
            success: function(data, status, xhr) {
                data["word"] = word;
                _this.findedWords.push(data); // register the word on the local dictionary
                _this.deferred.resolve();
            },
            error: function(xhr, exception) {
                _this.deferred.reject();
            }
        });

        return this.deferred.promise();
    }

    WordDictionary.prototype.isUndefinedWord = function(word) {
        for (var i = 0; i < this.undefinedWords.length; i++) {
            if (word == this.undefinedWords[i]) { return true; }
        }
        return false;
    }

    WordDictionary.prototype.stopFinding = function() {
        if (this.deferred != null) {
            this.deferred.reject();
        }
    }

    /// Exports
    if ("process" in global) { module.exports = WordDictionary; }
    global.WordDictionary = WordDictionary;

})((this || 0).self || global);
