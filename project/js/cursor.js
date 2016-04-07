(function(global) {

    /* **************************************************
     *                  Cursor
     ************************************************* */
    function Cursor() {
        this.word = "";
        this.wordRect = null;
        this.balloon = null;
        this.balloon = null;
        this.isOnBalloon = false;
    };

    /// Implementation
    Cursor.prototype.isFocusedOnWord = function(element, x, y) {
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
                    this.word = range.toString();
                    this.wordRect = {left:rect.left, right:rect.right, top:rect.top, bottom:rect.bottom};
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
                    return this.isFocusedOnWord(element.childNodes[i], x, y);
                }
                else {
                    range.detach();
                }
            }
        }
        return false;
    }

    Cursor.prototype.isFocusedOnBalloon = function Cursor() {
        return this.isOnBalloon;
    }

    Cursor.prototype.getWord = function() {
        return this.word;
    }

    Cursor.prototype.showBalloon = function(result) {
        this.hideBalloon();

        // make HTML
        var HTMLString = "";
        var word = result["word"];
        var results = result["definitions"];
        var HTMLString = '<style type="text/css"> .kzn-dictionary { width: 320px; height: 96px; color: #000; background-color: #eee; font-size: 16px; font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif; line-height: 110%; word-break: break-all; overflow: auto; overflow-x: hidden; } .kzn-word { margin: 8px 8px; } .kzn-verb { color: #e74c3c; } .kzn-noun { color: #1abc9c; } .kzn-adverb { color: #9b59b6; } .kzn-preposition { color: #f1c40f; } .kzn-adjective { color: #e67e22; } .kzn-pronoun { color: #2ecc71; } .kzn-conjunction { color: #3498db; } .kzn-definition { color: #333; font-style: italic; } .kzn-link { width: 320px; height: 24px; color: #000; margin-right: 12px; background-color: #eee; font-size: 12px; font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif; text-align: right; line-height: 200%; word-break: break-all; border-top: solid #bbb 1px; } .kzn-link a { margin: 0px 8px; } .kzn-link a:link { color: #888; } .kzn-link a:visited { color: #888; } .kzn-link a:hover { color: #888; } .kzn-link a:active { color: #888; } </style><div class="kzn-dictionary">';
        for (var i = 0; i < results.length; i++) {
            HTMLString += '<p class="kzn-word"><strong>' + word + '</strong><span class="kzn-' + results[i]["partOfSpeech"] + '"> (' + results[i]["partOfSpeech"] + ') </span><span class="kzn-definition">' + results[i]["definition"] + "</span></p>";
        }
        HTMLString += '</div><div class="kzn-link"><a href="http://dictionary.reference.com/browse/' + word + '" target="_blank">dictionary.com</a></div>';

        var leftOffset = $(window).scrollLeft();
        var topOffset = $(window).scrollTop();
        var left = leftOffset + this.wordRect.left - document.body.clientWidth/2.0;
        var top = - topOffset - this.wordRect.top

        // show
        $(document.body).showBalloon({
            contents: HTMLString,
            offsetX:left, offsetY:top,
            minLifetime: 0, showDuration: 0, hideDuration: 0,
            tipSize: 0
        });
        // cursor
        var _this = this;
        this.balloon = $("#kzn-balloon");
        this.balloon
            .mouseover(function() { _this.isOnBalloon = true; })
            .mouseout(function() { _this.isOnBalloon = false; });
    }

    Cursor.prototype.hideBalloon = function() {
        this.isOnBalloon = false;
        this.balloon = null;
        $(document.body).hideBalloon();
    }

    /// Exports
    if ("process" in global) { module.exports = Cursor; }
    global.Cursor = Cursor;

})((this || 0).self || global);
