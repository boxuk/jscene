/*global alert, confirm, unescape*/

// This file contains the tutorial part of Scene Creator - it handles updating
// the iframe preview and showing tips to the user
//

$(function() {
    var delay;

    function getInternetExplorerVersion()
    // Returns the version of Internet Explorer or a -1
    // (indicating the use of another browser).
    {
      var rv = -1; // Return value assumes failure.
      if (navigator.appName === 'Microsoft Internet Explorer')
      {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
          rv = parseFloat( RegExp.$1 );
        }
      }
      return rv;
    }

    // Initialize CodeMirror editor with a nice html5 canvas demo.
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        matchBrackets: true,
        tabMode: 'indent'
    });

    function wrap(javascript) {
        var s = "<!doctype html>\n"
                + "<html>\n"
                + "<body style=\"padding:0;margin:0;\">\n"
                + "  <canvas id=\"pane\" width=\"400\" height=\"300\"></canvas>\n";
        if(getInternetExplorerVersion() === 9) {
            s += "  <script type=\"text/javascript\" defer=\"defer\" src=\"js/jscene-iframe.js\"></script>\n"
              + "  <script type=\"text/javascript\" defer=\"defer\">try {\n"
              + javascript;
        } else {
            s += "  <script type=\"text/javascript\" src=\"js/jscene-iframe.js\"></script>\n"
              + "  <script type=\"text/javascript\"> try {\n"
              + javascript;
        }
        s += "\n    testConditions.valid = true;\n} catch(e) { console.log('Error in script ' + e); }\n";
        s += "\nwindow.onload = function () {"
        + "\n    window.parent.repaintListener(testConditions);"
        + "\n};\n"
        + "\n</script>\n";
        s += "</body>\n"
                + "</html>\n";
        return s;
    }

    /**
     * If the code the user has entered is valid JavaScript, then execute it,
     * otherwise, simply return
     *
     * @returns {null}
     */
    function updatePreview() {
        var newCode = editor.getValue();

        try {
            new Function(newCode);
            $('#code-valid').show();
            $('#code-invalid').hide();
        } catch(e) {
            $('#code-valid').hide();
            $('#code-invalid').show();
            return;
        }

        var previewFrame = document.getElementById('preview');
        var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
        preview.open();
        preview.write(wrap(newCode));
        preview.close();
    }

    editor.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
    });

    setTimeout(updatePreview, 300);

    function showInHelpBox(f) {
        $('#help').slideUp(200, function() {
            f();
            $('#help').slideDown();
        });
    }

    var tips = [{
        id: '#btnClearOut',
        title: 'A fresh start',
        helpText: '<div class="alert alert-success">Can you delete all the code in the box on the right?</div>',
        sampleCode: "// no code needed! Simply clear out the code in the box on the right\n",
        testConditions: function(config) {
            return config.ballInSky === null
                && config.timeOfDay === 'day';
        }
    }, {
        id: '#btnShowSun',
        title: 'Sun shine',
        helpText: '<div class="alert alert-success">Can you show the sun?</div>'
        +  '<div class="alert alert-info">You can show the sun by calling the <span class="inlineCode">showSun</span> function that has already been defined for you.</div>',
        sampleCode: "// show the sun\nshowSun();\n",
        testConditions: function(config) {
            return config.ballInSky === 'yellow'
                && config.timeOfDay === 'day';
        }
    },{
        id: '#btnShowMoon',
        title: 'Moon time!',
        helpText: '<div class="alert alert-success">Can you show the moon?</div>'
            + '<div class="alert alert-info">You can show the moon by calling the <span class="inlineCode">showMoon</span> function that has already been defined for you.</div>'
            + '<div class="alert alert-warning">Notice that if you call <span class="inlineCode">showMoon();</span> after other functions, it can draw over the top of what\'s underneath! This is due to the order that the code is executed in, so put it at the top of your code.</div>',
        sampleCode: "// show the sun\nshowMoon();\n",
        testConditions: function(config) {
            return config.ballInSky === 'lightgray'
                && config.timeOfDay === 'day';
        }
    },{
        id: '#btnShowSunAdvanced',
        title: 'Green sunshine',
        helpText: '<div class="alert alert-success">Can you turn the sun green?</div>'
                + '<div class="alert alert-info">The functions <span class="inlineCode">showSun</span> and <span class="inlineCode">showMoon</span> are'
                + ' actually a <b>wrapper</b> around the function <span class="inlineCode">showBallInSky</span> that passes a <b>parameter</b> in to tell it what colour to draw the ball. You could make the sun any colour you like! Wrapper functions are great for <b>composing functionality</b> - making something complicated out of lots of simple things.'
                + '</div>',
        sampleCode: "// show a red ball\nshowBallInSky('red');\n",
        testConditions: function(config) {
            return config.ballInSky === 'green'
                && config.timeOfDay === 'day';
        }
    },{
        id: '#btnPlantTree',
        title: 'Plant a tree',
        helpText: '<div class="alert alert-success">Can you plan a tree 100 pixels from the left and 200 pixels from the top?</div>'
            + '<div class="alert alert-info">You can plant a tree by <b>calling</b> the <b class="inlineCode">plantTree</b> function. You can tell the computer WHERE to plant the tree by using the parameters of plantTree.<br/><br/>The first parameter is how many pixels from the LEFT of the screen. The second parameter is how many pixels from the TOP of the screen (Cartesian co-ordinates).</div>',
        sampleCode: "// plant a tree 130 pixels from the left\n// and 100 pixels from the top\nplantTree(130, 100);\n",
        testConditions: function(config) {
            return config.treesPlanted > 0 && config.treePlantedAt100200;
        }
    },{
        id: '#btnPlantTreeAdvanced',
        title: 'Plant 5 trees',
        helpText: '<div class="alert alert-success">Can you plant 5 trees?</div>'
            + '<div class="alert alert-info">The function <span class="inlineCode">plantTree</span>'
                    + ' take two <b>arguments</b> also known as <b>parameters</b>. They are both <b>integers</b> which means "whole numbers". You can plant as many as you like - the function can be called as often as you want.'
                    + ' </div>',
        sampleCode: "plantTree(40, 150);\nplantTree(20, 170);\nplantTree(240, 110);\n",
        testConditions: function(config) {
            return config.treesPlanted === 5;
        }
    },{
        id: '#btnPlantRowOfTrees',
        title: 'Loopy for trees',
        helpText: '<div class="alert alert-success">Can you plant 10 trees using a loop?</div>'
                + '<div class="alert alert-info">You can use a <span class="inlineCode">for</span> loop and a little bit of simple maths to draw a row of trees.'
                +  '</div>',
        sampleCode: "// plant a row of trees"
                + "\nvar treesToPlant = 4;"
                + "\nfor (var i = 0; i < treesToPlant; i++) {"
                + "\n    var left = (i * (SCREEN_WIDTH / treesToPlant));"
                + "\n    plantTree(left, 180)"
                + "\n}\n",
        testConditions: function(config) {
            return config.treesPlanted === 10;
        }
    },{
        id: '#btnPlantRowOfTreesAdvanced',
        title: 'Random trees',
        helpText: '<div class="alert alert-success">Can you work out how to make tree placement more random?</div>'
                    + '<div class="alert alert-info">We use a <b>constant</b>, <span class="inlineCode">SCREEN_WIDTH</span>, so we don\'t have to write \'400\' every time we want to specify the width of the viewport. This is called <b>avoiding magic numbers</b> - magic is not good in programming! We like things to be clear!<br/><br/>'
                    + ' You could try doing a few things like adjust the number of trees to plant, or'
                    + ' adjusting the distance of each tree from the top. Here, we\'ve randomised them.',
        sampleCode: "// plant a row of trees"
                    + "\nvar treesToPlant = 7;"
                    + "\nvar randomness = 30;"
                    + "\nfor (var i = 0; i < treesToPlant; i++) {"
                    + "\n    var left = (i * (SCREEN_WIDTH / treesToPlant));"
                    + "\n    plantTree(left, 150 + Math.floor(Math.random() * randomness));"
                    + "\n}\n",
        testConditions: function(config) {
            return config.treesPlanted === 7;
        }
    },{
        id: '#btnMakeItNighttime',
        title: 'Make it night time!',
        helpText: '<div class="alert alert-success">Can you make it dark?</div>'
            + '<div class="alert alert-info"> You can make it night time by <b>calling</b> the <b>function</b> <span class="inlineCode">setTimeOfDay</span> and <b>passing in</b> the <b>parameter</b> \'night\'.</div>'
            + '<div class="alert alert-warning">You need to make sure that <span class="inlinecode">setTimeOfDay</span> is <b>called</b>'
            + ' before any other code, otherwise it could end up being displayed on top of trees!'
            + ' This is because code <b>executes</b> in the order it is written in.</div>',
        sampleCode: "// Make it night time\nsetTimeOfDay('night');\n",
        testConditions: function(config) {
            return config.timeOfDay === 'night';
        }
    },{
        id: '#btnMakeItNighttimeAdvanced',
        title: 'Using Canvas',
        helpText: '<div class="alert alert-success">Can you change the colours? Can you add more colour stops?</div>'
            + '<div class="alert alert-info">Under the hood, the <span class="inlineCode">setTimeOfDate</span> function'
            + ' uses something called the <a target="_BLANK" href="http://www.html5canvastutorials.com/">canvas</a>.'
            + ' You can draw onto this canvas in a variety of ways!<br/><br/>Get your Google on and work out how to change the sky colour gradients! You can draw anything on a Canvas!</div>',
        sampleCode: "var grad = context.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);"
                    + "\ngrad.addColorStop(0, 'red');"
                    + "\ngrad.addColorStop(0.2, 'orange');"
                    + "\ngrad.addColorStop(0.5, 'white');"
                    + "\ngrad.addColorStop(0.8, 'orange');"
                    + "\ngrad.addColorStop(1, 'red');"
                    + "\ncontext.fillStyle = grad;"
                    + "\ncontext.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);\n",
        testConditions: function(config) {
            return false; // this is the final test
        }
    }];

    function showTip(config) {
        showInHelpBox(function() {
            $('#puzzleTitle').html((tipPtr+1) + ": " + config.title);
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
    }

    for (var i = 0; i < tips.length; i++) {
        $(tips[i].id).click(function() {
            showTip(tips[i]);
        });
    }

    var tipPtr = -1;
    var finishShown = false;
    function setTip() {
        var config = tips[tipPtr];
        showTip(config);

        var perc = (100 * tipPtr/(tips.length - 1));
        $('.bar').css('width', perc + '%');
        if(!finishShown && perc === 100) {
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

        if(tipPtr <= 0) {
            $('#controls').hide();
        } else if(tipPtr === 1) {
            $('#controls').fadeIn();
        }else {
            $('#controls').show();
        }
    }

    function nextTip() {
        if(tipPtr < (tips.length - 1)) {
            ++tipPtr;
        }
        setTip();
    }
    function prevTip() {
        if(tipPtr > 0) {
            tipPtr--;
        }
        setTip();
    }

    window.nextTip = nextTip; // TODO remove

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

    $('#btnShowMe').click(function() {

        if (++showMeCount === SHOW_MES_BEFORE_WARN) {
            alert("You've used the 'Show me how!' button " + showMeCount
                    + " times now - you will probably learn more if you type the"
                    + " code in! It's up to you, we won't nag you again! :-)");
        }

        copySampleToLive();
    });

    if(window && window.localStorage && window.localStorage.getItem && window.localStorage.getItem('tutorial') === 'done') {
        $('#panelTipsAndTools, #panelYourScene, #panelYourCode').show();
        $('#btnReady, #btnReady2').hide();
        $('#btnHowTo').fadeIn();
        editor.refresh();
        nextTip()
    } else {
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
                                nextTip();
                            });
                        });
                    });
                });
            });
        });
    }

    $('#btnBack').click(function() {
        prevTip();
    });

    window.repaintListener = function(testConditions) {
        if(tipPtr < 0) {
            return;
        }

        if(!testConditions.valid) {
            console.log("Invalid script");
            $('#code-valid').hide();
            $('#code-invalid').show();
            return;
        }

        if(tips[tipPtr].testConditions(testConditions)) {
            nextTip();
        }
    };
});
