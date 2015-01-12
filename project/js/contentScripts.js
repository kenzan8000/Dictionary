chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.message == "Dictionary-On-Google-Chrome-Extension") {

        (function(global) {
            "use strict;"
/*
            var searchWord = function(word) {
                // API
                var API_URL = "https://www.wordsapi.com/words/" + word + "?accessToken=aYmh27eVOBWPZepqICu6nVXdwM";

                // ajax
                var deferred = jQuery.Deferred();
                jQuery.ajax({
                    type: "GET",
                    url: API_URL,
                    success: function(data, status, xhr) {
                        deferred.resolve();
                    },
                    error: function(xhr, exception) {
                        deferred.reject();
                    }
                });
                return deferred.promise();
            };
            searchWord(link, title)
                .fail(function() {
                })
                .done(function() {
                });
*/

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
                }
            });

        /*
            // Class ------------------------------------------------
            function YourModule() {
            };

            // Header -----------------------------------------------
            YourModule["prototype"]["method"] = YourModule_method; // YourModule#method(someArg:any):void

            // Implementation ---------------------------------------
            function YourModule_method(someArg) {
                // ...
            }

            // Exports ----------------------------------------------
            if ("process" in global) {
                module["exports"] = YourModule;
            }
            global["YourModule"] = YourModule;
        */
        })((this || 0).self || global);

    }
});

