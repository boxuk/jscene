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
              + "  <script type=\"text/javascript\" defer=\"defer\">"
              + javascript;
        } else {
            s += "  <script type=\"text/javascript\" src=\"js/jscene-iframe.js\"></script>\n"
              + "  <script type=\"text/javascript\">"
              + javascript;
        }

        s += "\nwindow.parent.repaintListener(testConditions);\n"
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

    $('#reset').click(function() {
        if (!confirm('Are you sure? This will clear all your work.')) {
            return;
        }

        editor.setValue("// your code goes here!");
    });

    function showInHelpBox(f) {
        $('#help').slideUp(200, function() {
            f();
            $('#help').slideDown();
        });
    }

    var tips = [{
        id: '#btnClearOut',
        title: 'A fresh start',
        helpText: 'Let\'s start by clearing all the code out of the box on the right!',
        sampleCode: "// no code needed! Simply clear out the code in the box on the right\n",
        testConditions: function(config) {
            return config.ballInSky === null
                && config.timeOfDay === 'day'
            ;
        }
    }, {
        id: '#btnShowSun',
        title: 'Sun shine',
        helpText: 'You can show the sun by calling the <span class="inlineCode">showSun</span> function that has already been defined for you.',
        sampleCode: "// show the sun\nshowSun();\n",
        testConditions: function(config) {
            return config.ballInSky === 'yellow'
                && config.timeOfDay === 'day'
            ;
        }
    },{
        id: '#btnShowMoon',
        title: 'Moon time!',
        helpText: 'You can show the moon by calling the <span class="inlineCode">showMoon</span> function that has already been defined for you.<br/><br/>Notice that if you call <span class="inlineCode">showMoon();</span> after other functions, it can draw over the top of what\'s underneath! This is due to the order that the code is executed in, so put it at the top of your code.',
        sampleCode: "// show the sun\nshowMoon();\n",
        testConditions: function(config) {
            return config.ballInSky === 'lightgray'
                && config.timeOfDay === 'day'
        }
    },{
        id: '#btnShowSunAdvanced',
        title: 'Green sunshine',
        helpText: 'The functions <span class="inlineCode">showSun</span> and <span class="inlineCode">showMoon</span> are'
                + ' actually a <b>wrapper</b> around the function <span class="inlineCode">showBallInSky</span> that passes a <b>parameter</b> in to tell it what colour to draw the ball. You could make the sun any colour you like! Wrapper functions are great for <b>composing functionality</b> - making something complicated out of lots of simple things.'
                + ' <br/><br/><b>Can you turn the sun green?</b>',
        sampleCode: "// show a red ball\nshowBallInSky('red');\n",
        testConditions: function(config) {
            return config.ballInSky === 'green'
                && config.timeOfDay === 'day'
        }
    },{
        id: '#btnPlantTree',
        title: 'Plant a tree',
        helpText: 'You can plant a tree by <b>calling</b> the <b class="inlineCode">plantTree</b> function. You can tell the computer WHERE to plant the tree by using the parameters of plantTree.<br/><br/>The first parameter is how many pixels from the LEFT of the screen. The second parameter is how many pixels from the TOP of the screen (Cartesian co-ordinates).'
            + '<br/><br/>Can you plan a tree 100 pixels from the left and 200 pixels from the top?',
        sampleCode: "// plant a tree 130 pixels from the left\n// and 100 pixels from the top\nplantTree(130, 100);\n",
        testConditions: function(config) {
            return config.treesPlanted > 0 && config.treePlantedAt100200;
        }
    },{
        id: '#btnPlantTreeAdvanced',
        title: 'Plant 5 trees',
        helpText: 'The function <span class="inlineCode">plantTree</span>'
                    + ' take two <b>arguments</b> also known as <b>parameters</b>. They are both <b>integers</b> which means "whole numbers". You can plant as many as you like - the function can be called as often as you want.'
                    + ' <br/><br/>Can you plant 5 trees?',
        sampleCode: "plantTree(40, 150);\nplantTree(20, 170);\nplantTree(240, 110);\n",
        testConditions: function(config) {
            return config.treesPlanted === 5;
        }
    },{
        id: '#btnPlantRowOfTrees',
        title: 'Loopy for trees',
        helpText: 'You can use a <span class="inlineCode">for</span> loop and a little bit of simple maths to draw a row of trees.<br/><br/>Can you <b>plant 10 trees?</b>',
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
        helpText: 'We use a <b>constant</b>, <span class="inlineCode">SCREEN_WIDTH</span>, so we don\'t have to write \'400\' every time we want to specify the width of the viewport. This is called <b>avoiding magic numbers</b> - magic is not good in programming! We like things to be clear!<br/><br/>'
                    + ' You could try doing a few things like adjust the number of trees to plan, or'
                    + ' adjusting the distance of each tree from the top. Here, we\'ve randomised them. <br/><br/><b>an you work out how to make it more random?</b>',
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
        helpText: 'You can make it night time by <b>calling</b> the <b>function</b> <span class="inlineCode">setTimeOfDay</span> and <b>passing in</b> the <b>parameter</b> \'night\'.'
            + '<br/><br/>You need to make sure that <span class="inlinecode">setTimeOfDay</span> is <b>called</b>'
            + ' before any other code, otherwise it could end up being displayed on top of trees!'
            + ' This is because code <b>executes</b> in the order it is written in.',
        sampleCode: "// Make it night time\nsetTimeOfDay('night');\n",
        testConditions: function(config) {
            return config.timeOfDay === 'night'
        }
    },{
        id: '#btnMakeItNighttimeAdvanced',
        title: 'Using Canvas',
        helpText: 'Under the hood, the <span class="inlineCode">setTimeOfDate</span> function'
            + ' uses something called the <a target="_BLANK" href="http://www.html5canvastutorials.com/">canvas</a>. You can draw onto this canvas in a variety of ways!<br/><br/>Get your Google on and work out how to change the sky colour gradients! You can draw anything on a Canvas!',
        sampleCode: "var grad = context.createLinearGradient(0,0,0,150);"
                    + "\ngrad.addColorStop(0, '#000000');"
                    + "\ngrad.addColorStop(0.2, '#00CC00');"
                    + "\ngrad.addColorStop(0.5, '#0000CC');"
                    + "\ngrad.addColorStop(0.8, '#CC0000');"
                    + "\ngrad.addColorStop(1, '#222222');"
                    + "\ncontext.fillStyle = grad;"
                    + "\ncontext.fillRect(0, 0, SCREEN_WIDTH, 150);\n"
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
    function setTip() {
        var config = tips[tipPtr];
        showTip(config);
        // TODO if full...
        // TODO show progress bar...
        if(tipPtr <= 0) {
            $('#controls').hide();
        } else if(tipPtr === 1) {
            $('#controls').fadeIn();
        }else {
            $('#controls').show();
        }
    }

    function nextTip() {
        if(tipPtr <= tips.length) {
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

//    function setUpTip(config) {
//        $(config.id).click(function() {
//            showInHelpBox(function() {
//                $('#btnMoreInfo').show();
//                $('#helpText').html(config.helpText);
//                $('#sampleCode').html(config.sampleCode);
//                $('#btnMoreInfo').click(function() {
//                    showInHelpBox(function() {
//                        $('#btnMoreInfo').hide();
//                        config.moreInfoFunction();
//                    });
//                });
//            });
//        });
//    }


    var showMeCount = 0;
    var SHOW_MES_BEFORE_WARN = 5;

    $('#btnShowMe').click(function() {

        if (++showMeCount === SHOW_MES_BEFORE_WARN) {
            alert("You've used the 'Show me how!' button " + showMeCount
                    + " times now - you will probably learn more if you type the"
                    + " code in! It's up to you, we won't nag you again! :-)");
        }

        var val = null;
        try {
            val = $('#sampleCode')[0].textContent;
        }
        catch (e) {
            val = $('#sampleCode').html();
        }
        editor.setValue(editor.getValue() + "\n" + unescape(val));
    });

    $('#oneIMadeEarlier').click(function() {
        if (!confirm('Are you sure? This will clear all your work.')) {
            return;
        }

        editor.setValue(
                "// Here is one that we've filled out already. Play around\n"
                + "// with it and see what you can come up with!\n\n"
                + "// Make it night time\n"
                + "setTimeOfDay('night');\n"
                + "\n"
                + "// show the sun\n"
                + "showSun();\n"
                + "\n"
                + "// plant a tree 100 pixels from the left\n"
                + "// and 200 pixels from the top\n"
                + "plantTree(130, 100);\n"
                + "\n"
                + "// plant a row of trees\n"
                + "var treesToPlant = 4;\n"
                + "for (var i = 0; i < SCREEN_WIDTH; i++) {\n"
                + "    var left = (i * (SCREEN_WIDTH / treesToPlant));\n"
                + "    plantTree(left, 180)\n"
                + "}");
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

    function showSuccessMessage(m) {
        // TODO
        console.log(m);
    }

    $('#btnBack').click(function() {
        prevTip();
    });

    window.repaintListener = function(testConditions) {
        if(tips[tipPtr].testConditions(testConditions)) {

            showSuccessMessage('Great success!');
            nextTip();
        }
    };
});

