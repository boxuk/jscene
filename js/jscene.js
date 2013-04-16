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
              + "  <script type=\"text/javascript\" defer=\"defer\">try {\n";
        } else {
            s += "  <script type=\"text/javascript\" src=\"js/jscene-iframe.js\"></script>\n"
              + "  <script type=\"text/javascript\"> try {\n";
        }

        // Add the user's javascript to our variable
        s += userCode;

        // If the code is valid, set testConditions.valid to true - see [jscene-iframe.js
        // for more information on this
        s += "\n    testConditions.valid = true;\n} catch(e) {  }\n";

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
        var newCodeCs = editor.getValue();
        var newCode = CoffeeScript.compile(newCodeCs, {
            bare: true
          });

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

    // Define a set of exercices in a JSONish format (it's JSON but it has comments!)
    // These are the jobs that the user must do and the criteria to progress through them
    var exercices = [{
        // An exercise - can the user delete all the code?
        // Set the title of this exercise
        title: 'A fresh start',
        // Set the text that comes up when this exercise is in play
        helpText: '<div class="alert alert-success">Can you delete all the code in the box on the right?</div>',
        // Set the sample code to show for this exercise
        sampleCode: "// no code needed! Simply clear out the code in the box on the right\n",
        // Set a function to be run to check whether this exercise has been completed.
        // If this function returns true, then we can pass on to the next exercise!
        testConditions: function(config) {
            return config.ballInSky === null
                && config.timeOfDay === 'day';
        }
    }, {
        // An exercise - this one tests to see if the user can make the sun shine
        title: 'Sun shine',
        helpText: '<div class="alert alert-success">Can you show the sun?</div>'
        +  '<div class="alert alert-info">You can show the sun by calling the <span class="inlineCode">showSun</span> function that has already been defined for you.</div>',
        sampleCode: "\ndo showSun\n",
        testConditions: function(config) {
            return config.ballInSky === 'yellow'
                && config.timeOfDay === 'day';
        }
    },{
        // An exercise - this one tests to see if the user can show the moon
        title: 'Moon time!',
        helpText: '<div class="alert alert-success">Can you show the moon?</div>'
            + '<div class="alert alert-info">You can show the moon by calling the <span class="inlineCode">showMoon</span> function that has already been defined for you.</div>'
            + '<div class="alert alert-warning">Notice that if you call <span class="inlineCode">showMoon();</span> after other functions, it can draw over the top of what\'s underneath! This is due to the order that the code is executed in, so put it at the top of your code.</div>',
        sampleCode: "\ndo showMoon\n",
        testConditions: function(config) {
            return config.ballInSky === 'lightgray'
                && config.timeOfDay === 'day';
        }
    },{
        // An exercise - this one tests to see if the user can show green sunshine
        // by editing parameters of a function
        title: 'Green sunshine',
        helpText: '<div class="alert alert-success">Can you turn the sun green?</div>'
                + '<div class="alert alert-info">The functions <span class="inlineCode">showSun</span> and <span class="inlineCode">showMoon</span> are'
                + ' actually a <b>wrapper</b> around the function <span class="inlineCode">showBallInSky</span> that passes a <b>parameter</b> in to tell it what colour to draw the ball. You could make the sun any colour you like! Wrapper functions are great for <b>composing functionality</b> - making something complicated out of lots of simple things.'
                + '</div>',
        sampleCode: "do showBallInSky 'red'\n",
        testConditions: function(config) {
            return config.ballInSky === 'green'
                && config.timeOfDay === 'day';
        }
    },{
        // An exercise - this one tests to see if the user can show plant a tree
        // at a certain location
        title: 'Plant a tree',
        helpText: '<div class="alert alert-success">Can you plan a tree 100 pixels from the left and 200 pixels from the top?</div>'
            + '<div class="alert alert-info">You can plant a tree by <b>calling</b> the <b class="inlineCode">plantTree</b> function. You can tell the computer WHERE to plant the tree by using the parameters of plantTree.<br/><br/>The first parameter is how many pixels from the LEFT of the screen. The second parameter is how many pixels from the TOP of the screen (Cartesian co-ordinates).</div>',
        sampleCode: "do plantTree 130, 100\n",
        testConditions: function(config) {
            return config.treesPlanted > 0 && config.treePlantedAt100200;
        }
    },{
        // An exercise - this one tests to see if the user can show plant 5 trees
        // by calling a function multiple times
        title: 'Plant 5 trees',
        helpText: '<div class="alert alert-success">Can you plant 5 trees?</div>'
            + '<div class="alert alert-info">The function <span class="inlineCode">plantTree</span>'
                    + ' take two <b>arguments</b> also known as <b>parameters</b>. They are both <b>integers</b> which means "whole numbers". You can plant as many as you like - the function can be called as often as you want.'
                    + ' </div>',
        sampleCode: "do plantTree 40, 150\ndo plantTree 20, 170\ndo plantTree 240, 110\n",
        testConditions: function(config) {
            return config.treesPlanted === 5;
        }
    },{
        // An exercise - can the user draw multiple trees in a loop?
        title: 'Loopy for trees',
        helpText: '<div class="alert alert-success">Can you plant 10 trees using a loop?</div>'
                + '<div class="alert alert-info">You can use a <span class="inlineCode">for</span> loop and a little bit of simple maths to draw a row of trees.'
                +  '</div>',
        sampleCode: "// plant a row of trees"
                + "\nvar treesToPlant = 4"
                + "\nfor (var i = 0; i < treesToPlant; i++) {"
                + "\n    var left = (i * (SCREEN_WIDTH / treesToPlant))"
                + "\n    do plantTree left, 180 "
                + "\n}\n",
        testConditions: function(config) {
            // Note that the test conditions are not sophisticated enough to truly
            // detect that a loop has been used. In the interests of keeping the code
            // light, we didn't go too far with that
            return config.treesPlanted === 10;
        }
    },{
        // An exercise - can the user employ and adjust randomness?
        title: 'Random trees',
        helpText: '<div class="alert alert-success">Can you work out how to make tree placement more random?</div>'
                    + '<div class="alert alert-info">We use a <b>constant</b>, <span class="inlineCode">SCREEN_WIDTH</span>, so we don\'t have to write \'400\' every time we want to specify the width of the viewport. This is called <b>avoiding magic numbers</b> - magic is not good in programming! We like things to be clear!<br/><br/>'
                    + ' You could try doing a few things like adjust the number of trees to plant, or'
                    + ' adjusting the distance of each tree from the top. Here, we\'ve randomised them.',
        sampleCode: "// plant a row of trees"
                    + "\nvar treesToPlant = 7"
                    + "\nvar randomness = 30"
                    + "\nfor (var i = 0; i < treesToPlant; i++) {"
                    + "\n    var left = (i * (SCREEN_WIDTH / treesToPlant))"
                    + "\n    do plantTree left, 150 + Math.floor(Math.random() * randomness)"
                    + "\n}\n",
        testConditions: function(config) {
            // Note that the test conditions are not sophisticated enough to truly
            // detect that randomness has been used. In the interests of keeping the code
            // light, we didn't go too far with that
            return config.treesPlanted === 7;
        }
    },{
        // An exercise - can the user make it night time?
        title: 'Make it night time!',
        helpText: '<div class="alert alert-success">Can you make it dark?</div>'
            + '<div class="alert alert-info"> You can make it night time by <b>calling</b> the <b>function</b> <span class="inlineCode">setTimeOfDay</span> and <b>passing in</b> the <b>parameter</b> \'night\'.</div>'
            + '<div class="alert alert-warning">You need to make sure that <span class="inlinecode">setTimeOfDay</span> is <b>called</b>'
            + ' before any other code, otherwise it could end up being displayed on top of trees!'
            + ' This is because code <b>executes</b> in the order it is written in.</div>',
        sampleCode: "do setTimeOfDay 'night'\n",
        testConditions: function(config) {
            return config.timeOfDay === 'night';
        }
    },{
        // Free play - let the user loose on Canvas!
        title: 'Using Canvas',
        helpText: '<div class="alert alert-success">Can you change the colours? Can you add more colour stops?</div>'
            + '<div class="alert alert-info">Under the hood, the <span class="inlineCode">setTimeOfDay</span> function'
            + ' uses something called the <a target="_BLANK" href="http://www.html5canvastutorials.com/">canvas</a>.'
            + ' You can draw onto this canvas in a variety of ways!<br/><br/>Get your Google on and work out how to change the sky colour gradients! You can draw anything on a Canvas!</div>',
        sampleCode: "grad = context.createLinearGradient 0, 0, 0, SCREEN_HEIGHT"
                    + "\ngrad.addColorStop 0, 'red'"
                    + "\ngrad.addColorStop 0.2, 'orange'"
                    + "\ngrad.addColorStop 0.5, 'white'"
                    + "\ngrad.addColorStop 0.8, 'orange'"
                    + "\ngrad.addColorStop 1, 'red'"
                    + "\ncontext.fillStyle = grad"
                    + "\ncontext.fillRect 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT\n",
        testConditions: function(config) {
            return false; // this is the final test
        }
    }];

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

    // Function that advances the exercise the user is looking at. Symmetric to prevExercise

    /**
     * advance the exercise the user is looking at. Symmetric to prevExercise
     * @returns {null}
     */
    function nextExercise() {
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
    window.nextTip = nextExercise;
});

// stubs
function showSun() {}
