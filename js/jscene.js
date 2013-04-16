/*global alert, confirm, unescape*/

// This file contains the tutorial part of jScene - it handles updating
// the iframe preview and showing tips to the user
//
// This file is included in the main window and is not included in the
// iframe that shows the preview

/* jScene - scene creator tool in JavaScript */

// Wrap the code in a closure. This isolates it and means it doesn't
// make a mess in the browser's memory by creating lots of global functions
$(function() {

    // A timer function - when the user writes some code, the preview window is
    // updated, but only once the user has stopped typing. This is why we use
    // a delay.
    var delay;

    // Function that is used to work out if the user is on Internet Explorer,
    // which is the most problematic of web browsers! If they are, we have
    // to do a couple of things slightly differently.

    /**
     * Returns the version of Internet Explorer or a -1
     * @returns {int} Version of IE, or -1 if browser is not IE
     */
    function getInternetExplorerVersion() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName === 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re  = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
            if (re.exec(ua) !== null) {
                rv = parseFloat( RegExp.$1 );
            }
        }

        return rv;
    }

    // Initialize CodeMirror editor - turn on bracket matching and line numbers
    // and set the tab mode to indentation.
    //
    // This takes the HTML element with id "code" and turns it into a code
    // editor.
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        matchBrackets: true,
        tabMode: 'indent'
    });

    // Function that takes a block of code and turns it into a whole 'page' by
    // 'wrapping' it in HTML. This means that the code the user inputs gets
    // wrapped up into a complete web page which is then shown in the preview
    // iframe.

    /**
     * Take a block of JavaScript code, which has already been validated, and
     * wrap it up in an HTML page
     *
     * @param {string} userCode The javascript code to put into the iframe
     * @returns {String} The value of "javascript" wrapped up in a complete HTML
     * document, ready for display in the iframe
     */
    function wrap(userCode) {
        // Create a variable s that will contain all the HTML. Start it off by
        // adding an HTML document header and drawing a canvas.
        var s = "<!doctype html>\n"
                + "<html>\n"
                + "<body style=\"padding:0;margin:0;\">\n"
                + "  <canvas id=\"pane\" width=\"400\" height=\"300\"></canvas>\n";

        // On Internet Explorer 9, we have to defer the loading of the JavaScript.
        // This probably warrants further investigation!
        if(getInternetExplorerVersion() === 9) {
            s += "  <script type=\"text/javascript\" defer=\"defer\" src=\"js/jscene-iframe.js\"></script>\n"
              + "  <script type=\"text/javascript\" defer=\"defer\">";
        } else {
            s += "  <script type=\"text/javascript\" src=\"js/jscene-iframe.js\"></script>\n"
              + "  <script type=\"text/javascript\">";

        }
        s += "var birds = 0;"
          +  "try {\n"
        ;

        // Add the user's javascript to our variable
        s += userCode;

        // If the code is valid, set testConditions.valid to true - see [jscene-iframe.js
        // for more information on this
        s += "\n    testConditions.valid = true;\n"
        s += "\n} catch(e) {";
        s += "\n    console.log(\"ERROR PARSING\");";
        s += "\n    console.log(e);";
        s += "\n}\n";

        s += "\nfor(var i = 0; i < birds; i++) {"
          +  "\n    drawBird(i);"
          +  "\n}"
          +  "\ntestConditions.birds = birds;";

        // When the iframe loads, it should call the repaint listener and tell
        // the code in jscene.js "hey, here are the test conditions" so that
        // the code can work out whether to advance to the next exercise or not
        s += "\nwindow.onload = function () {"
        + "\n    window.parent.repaintListener(testConditions);"
        + "\n};\n"
        + "</script>\n"
        + "</body>\n"
        + "</html>\n";

        // Return the complete HTML ready to be put into the preview iframe
        return s;
    }

    // Function that updates the preview iframe if the user's code seems to
    // be valid

    /**
     * If the code the user has entered is valid JavaScript, then execute it,
     * otherwise, simply return
     *
     * @returns {null}
     */
    function updatePreview() {

        // Get the code that the user has written
        var newCode = editor.getValue();

        // Have a go at parsing that code. Is it valid code?
        try {
            new Function(newCode);
            // If the code is valid, show a code valid sign
            $('#code-valid').show();
            $('#code-invalid').hide();
        } catch(e) {
            // If the code is not valid, show a code invalid sign and don't
            // update the preview window
            $('#code-valid').hide();
            $('#code-invalid').show();

            // leave the function
            return;
        }

        // Update the code in the preview iframe, which draws the user's work
        var previewFrame = document.getElementById('preview');
        var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
        preview.open();
        preview.write(wrap(newCode));
        preview.close();
    }

    // When the user writes new code, update the preview window after a delay
    // of 300ms
    editor.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
    });

    // After a delay of 300ms, call the updatePreview function to draw the initial
    // scene
    setTimeout(updatePreview, 300);

    // Function that hides then updates then shows the help box. You pass in your
    // own function (you can pass functions to functions in JavaScript! It's very
    // powerful to be able to do this) and this function is run and then the help
    // box is shown.

    /**
     * Slide the help box up then call function f then slide the help box down
     *
     * @param {function} fnToRun The function to run once the help box is hidden,
     * run before the help box is shown again.
     *
     * @returns {null}
     */
    function showInHelpBox(fnToRun) {
        $('#help').slideUp(200, function() {
            fnToRun();
            $('#help').slideDown();
        });
    }

    var exercices = window.jscene.exercises;

    // number that refers to the position in the exercies array that the user
    // is currently on
    var exercisePtr = -1;

    var showMeCount = 0;
    var SHOW_MES_BEFORE_WARN = 4;
    function copySampleToLive() {
        var val = null;
        try {
            val = $('#sampleCode')[0].textContent;
        }
        catch (e) {
            val = $('#sampleCode').html();
        }
        editor.setValue(editor.getValue() + "\n" + unescape(val));
    }

    // Has the finish screen been shown?
    var finishShown = false;

    // Function that renders the current exercise, and update the progress meter

    /**
     * render the current exercise, and update the progress meter
     *
     * @returns {null}
     */
    function updateExercise() {

        // get the configuration of the current exercise
        var config = exercices[exercisePtr];

        // draw the current exercise
        showInHelpBox(function() {
            $('#puzzleTitle').html((exercisePtr+1) + ": " + config.title);
            $('#btnMoreInfo').show();
            $('#helpText').html(config.helpText);
            $('#sampleCode').html(config.sampleCode);
            $('#btnMoreInfo').click(function() {
                showInHelpBox(function() {
                    $('#btnMoreInfo').hide();
                    config.moreInfoFunction();
                });
            });
        });

        // Update the progress bar
        var perc = (100 * exercisePtr/(exercices.length - 1));
        $('.bar').css('width', perc + '%');

        // Check to see if the user finished all the exercises
        if(!finishShown && perc === 100) {
            // After a brief delay, show the "finished" screen, if it's never
            // been shown before
            finishShown = true;
            setTimeout(function() {
                $("#finishScreen")
                    .modal('show')
                    .on('hide', function() {
                        editor.setValue('');
                        copySampleToLive();
                    });
            }, 1000);
        }

        // Show the back and forth controls only if the first exercise is complete.
        if(exercisePtr <= 0) {
            // Hide back/forth controls if user is on the first exercise
            $('#controls').hide();
        } else if(exercisePtr === 1) {
            // Show back control if user is on the second exercise
            $('#controls').fadeIn();
        } else {
            // Show controls if user is beyond the second exercise
            $('#controls').show();
        }
    }


    // collection of things the user has used - functions, code snippets, etc -
    // for easy referencing

    var thingsUsed = [];

    // Function that advances the exercise the user is looking at. Symmetric to prevExercise

    /**
     * advance the exercise the user is looking at. Symmetric to prevExercise.
     * @returns {null}
     */
    function nextExercise() {
        if(exercisePtr > 0) {
            var config = exercices[exercisePtr];
            thingsUsed[exercisePtr] = config.completionNotes;

            var s = "";
            for (var i = 0; i < thingsUsed.length; i++) {
                if(thingsUsed[i] !== null && thingsUsed[i] !== undefined) {
                    s += "<pre class='thingUsed'>"  + thingsUsed[i] + '</pre>';
                }
            }
            $('#thingsUsed').html(s);
            if(thingsUsed.length > 1) {
                $('#thingsUsedWrapper').fadeIn('slow');
            }
        }

        // If we're not at the end of the exercise list, then go to the next
        // exercise
        if(exercisePtr < (exercices.length - 1)) {
            ++exercisePtr;
        }
        updateExercise();
    }

    // Function that regresses the exercise the user is looking at. Symmetric to nextExercise

    /**
     * regress the exercise the user is looking at. Symmetric to nextExercise
     * @returns {null}
     */
    function prevExercise() {
        // If we're not at the start of the exercise list, then go to the next
        // exercise
        if(exercisePtr > 0) {
            exercisePtr--;
        }
        updateExercise();
    }

    // Use jQuery to wire up the "show me" back button to copy sample code into
    // the user's code editor in the middle pane
    $('#btnShowMe').click(function() {
        // If the user seems to be using this functionality a lot, s/he might
        // not learn as well, so pop up an alert to this effect
        if (++showMeCount === SHOW_MES_BEFORE_WARN) {
            alert("You've used the 'Show me how!' button " + showMeCount
                    + " times now - you will probably learn more if you type the"
                    + " code in! It's up to you, we won't nag you again! :-)");
        }

        // Copy the code from the coding sample on the leftmost pane into the
        // code editor in the central pane
        copySampleToLive();
    });

    // Check to see if the tutorial is complete. If so, don't bother showing it
    if(window && window.localStorage && window.localStorage.getItem && window.localStorage.getItem('tutorial') === 'done') {
        // Show the main panels
        $('#panelTipsAndTools, #panelYourScene, #panelYourCode').show();
        // Hide the info on Your scene
        $('#yourSceneInfo').hide();
        // update the code display
        editor.refresh();
        // show the first tip
        nextExercise();
    } else {
        // The tutorial hasn't been run, so run the user through a quick tutorial
        // OK, this code here is a bit hideous and needs refactoring!
        $('#panelTipsAndTools').fadeIn(400, function() {
            $('#btnReady').click(function() {
                $('#btnReady').fadeOut();
                $('#panelYourScene').fadeIn(400, function() {
                    $('#btnReady2').click(function() {
                        $('#yourSceneInfo').fadeOut();
                        editor.refresh();
                        $('#panelYourCode').fadeIn(400, function() {
                            editor.refresh();

                            $('#introText').fadeOut(400, function() {
                                $('#introText').html('The button above will help you get started!');
                                $('#btnHowTo, #introText').fadeIn();
                                if(window && window.localStorage && window.localStorage.setItem) {
                                     window.localStorage.setItem('tutorial', 'done');
                                }
                                nextExercise();
                            });
                        });
                    });
                });
            });
        });
    }

    // Use jQuery to wire up the back button to call the prevTip function
    $('#btnBack').click(function() {
        prevExercise();
    });

    // Function that is called from jscene-iframe.js. It is on the "window"
    // object so that it is global - it can be accessed outside of this closure.

    /**
     * @param {object} testConditions The collection to test against the current
     * exercise's testConditions function
     * @returns {null}
     */
    window.repaintListener = function(testConditions) {

        // If we are not on an exercise, don't do anything
        if(exercisePtr < 0) {
            return;
        }

        // If the code the user has entered isn't valid, simply show the code
        // invalid badge and do nothing.
        if(!testConditions.valid) {
            $('#code-valid').hide();
            $('#code-invalid').show();
            return;
        }

        // If the user has passed the test, then advance to the next tip.
        if(exercices[exercisePtr].testConditions(testConditions)) {
            nextExercise();
        }
    };

    // Make the nextTip function globally accessible. This is useful for debugging
    // so, for example, you can call nextTip(); in the browser console to skip
    // an exercise.
    window.nextEx = nextExercise;
});
