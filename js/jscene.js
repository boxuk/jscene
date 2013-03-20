/* global alert, confirm, unescape */

// This file contains the tutorial part of Scene Creator - it handles updating
// the iframe preview and showing tips to the user
//

$(function() {
    var delay;

    function updatePreview() {
        var previewFrame = document.getElementById('preview');
        var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
        preview.open();
        preview.write(wrap(editor.getValue()));
        preview.close();
    }

    // Initialize CodeMirror editor with a nice html5 canvas demo.
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        matchBrackets: true,
        tabMode: 'indent'
    });
    editor.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
    });

    function wrap(javascript) {
        return "<!doctype html>\n"
                + "<html>\n"
                + "<body style=\"padding:0;margin:0;\">\n"
                + "  <canvas id=\"pane\" width=\"400\" height=\"300\"></canvas>\n"
                + "  <script type=\"text/javascript\" defer=\"defer\" src=\"js/jscene-iframe.js\"></script>\n"
                + "  <script type=\"text/javascript\" defer=\"defer\">"
                + javascript
                + "\n</script>\n"
                + "</body>\n"
                + "</html>\n";
    }

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

    function setUpTip(config) {
        $(config.id).click(function() {
            showInHelpBox(function() {
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
        });
    }

    var infoOnCelestialBodies = function() {
        $('#helpText').html('The functions <span class="inlineCode">showSun</span> and <span class="inlineCode">showMoon</span> are'
                + ' actually a <b>wrapper</b> around the function <span class="inlineCode">showBallInSky</span> that passes a <b>parameter</b> in to tell it what colour to draw the ball. You could make the sun any colour you like! Wrapper functions are great for <b>composing functionality</b> - making something complicated out of lots of simple things.');

        $('#sampleCode').html("// show a red ball\nshowBallInSky('red');\n");
    };

    setUpTip({
        id: '#btnShowSun',
        helpText: 'You can show the sun by calling the <span class="inlineCode">showSun</span> function that has already been defined for you.',
        sampleCode: "// show the sun\nshowSun();\n",
        moreInfoFunction: infoOnCelestialBodies
    });
    setUpTip({
        id: '#btnShowMoon',
        helpText: 'You can show the moon by calling the <span class="inlineCode">showSun</span> function that has already been defined for you.<br/><br/>Notice that if you call <span class="inlineCode">showMoon();</span> after other functions, it can draw over the top of what\'s underneath! This is due to the order that the code is executed in, so put it at the top of your code.',
        sampleCode: "// show the sun\nshowMoon();\n",
        moreInfoFunction: infoOnCelestialBodies
    });

    setUpTip({
        id: '#btnPlantTree',
        helpText: 'You can plant a tree by <b>calling</b> the <b class="inlineCode">plantTree</b> function. You can tell the computer WHERE to plant the tree by using the parameters of plantTree.<br/><br/>The first parameter is how many pixels from the LEFT of the screen. The second parameter is how many pixels from the TOP of the screen (Cartesian co-ordinates).',
        sampleCode: "// plant a tree 130 pixels from the left\n// and 100 pixels from the top\nplantTree(130, 100);\n",
        moreInfoFunction: function() {
            $('#helpText').html('The function <span class="inlineCode">plantTree</span>'
                    + ' take two <b>arguments</b> also known as <b>parameters</b>. They are both <b>integers</b> which means "whole numbers". You can plant as many as you like - the function can be called as often as you want.');

            $('#sampleCode').html("plantTree(40, 150);\nplantTree(20, 170);\nplantTree(240, 110);\n");
        }
    });

    setUpTip({
        id: '#btnPlantRowOfTrees',
        helpText: 'You can use a <span class="inlineCode">for</span> loop and a little bit of simple maths to draw a row of trees.',
        sampleCode: "// plant a row of trees"
                + "\nvar treesToPlant = 4;"
                + "\nfor (var i = 0; i < SCREEN_WIDTH; i++) {"
                + "\n    var left = (i * (SCREEN_WIDTH / treesToPlant));"
                + "\n    plantTree(left, 180)"
                + "\n}\n",
        moreInfoFunction: function() {
            $('#helpText').html('We use a <b>constant</b>, <span class="inlineCode">SCREEN_WIDTH</span>, so we don\'t have to write \'400\' every time we want to specify the width of the viewport. This is called <b>avoiding magic numbers</b> - magic is not good in programming! We like things to be clear!<br/><br/>'
                    + ' You could try doing a few things like adjust the number of trees to plan, or'
                    + ' adjusting the distance of each tree from the top. Here, we\'ve randomised them. Can you work out how to make it more random?');

            $('#sampleCode').html("// plant a row of trees"
                    + "\nvar treesToPlant = 10;"
                    + "\nfor (var i = 0; i < SCREEN_WIDTH; i++) {"
                    + "\n    var left = (i * (SCREEN_WIDTH / treesToPlant));"
                    + "\n    plantTree(left, 150 + Math.floor(Math.random() * 30));"
                    + "\n}\n");
        }
    });

    setUpTip({
        id: '#btnMakeItNighttime',
        helpText: 'You can make it night time by <b>calling</b> the <b>function</b> <span class="inlineCode">setTimeOfDay</span> and <b>passing in</b> the <b>parameter</b> \'night\'.',
        sampleCode: "// Make it night time\nsetTimeOfDay('night');\n",
        moreInfoFunction: function() {
            $('#helpText').html('Under the hood, the <span class="inlineCode">setTimeOfDate</span> function uses something called the <a target="_BLANK" href="http://www.html5canvastutorials.com/">canvas</a>. You can draw onto this canvas in a variety of ways!<br/><br/>Get your Google on and work out how to change the sky colour gradients! You can draw anything on a Canvas!');

            $('#sampleCode').html("var grad = context.createLinearGradient(0,0,0,150);"
                    + "\ngrad.addColorStop(0, '#000000');"
                    + "\ngrad.addColorStop(0.2, '#00CC00');"
                    + "\ngrad.addColorStop(0.5, '#0000CC');"
                    + "\ngrad.addColorStop(0.8, '#CC0000');"
                    + "\ngrad.addColorStop(1, '#222222');"
                    + "\ncontext.fillStyle = grad;"
                    + "\ncontext.fillRect(0, 0, SCREEN_WIDTH, 150);\n");
        }
    });

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
                        });
                    });
                });
            });
        });
    });
});
