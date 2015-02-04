(function(global) {

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

        var leftOffset = $(window).scrollLeft();
        var topOffset = $(window).scrollTop();
        var left = leftOffset + Cursor_wordRect.left - document.body.clientWidth/2.0;
        var top = - topOffset - Cursor_wordRect.top

        // show
        $(document.body).showBalloon({
            contents: HTMLString,
            offsetX:left, offsetY:top,
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

})((this || 0).self || global);
