window.jscene = window.jscene||{};

// Define a set of exercices in a JSONish format (it's JSON but it has comments!)
// These are the jobs that the user must do and the criteria to progress through them
window.jscene.exercises = [{
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
        return config.orb === null
            && config.timeOfDay === 'day';
    },
    completionNotes: null
}, {
    // An exercise - this one tests to see if the user can make the sun shine
    title: 'Sun shine',
    helpText: '<div class="alert alert-success">Can you show the sun?</div>'
    +  '<div class="alert alert-info">You can show the sun by using the <span class="inlineCode">sun</span> function that has already been defined for you.</div>',
    sampleCode: "sun();\n",
    testConditions: function(config) {
        return config.orb === 'yellow'
            && config.timeOfDay === 'day';
    },
    completionNotes: 'sun();'
},{
    // An exercise - this one tests to see if the user can show the moon
    title: 'Moon time!',
    helpText: '<div class="alert alert-success">Can you show the moon?</div>'
        + '<div class="alert alert-info">You can show the moon by using the <span class="inlineCode">moon</span> function that has already been defined for you.</div>'
        + '<div class="alert alert-warning">Notice that if you use <span class="inlineCode">moon();</span> after other functions, it can draw over the top of what\'s underneath! This is due to the order that the code is run in, so put it at the top of your code.</div>',
    sampleCode: "moon();\n",
    testConditions: function(config) {
        return config.orb === 'lightgray'
            && config.timeOfDay === 'day';
    },
    completionNotes: 'moon();'
},{
    // An exercise - this one tests to see if the user can show green sunshine
    // by editing parameters of a function
    title: 'Green sunshine',
    helpText: '<div class="alert alert-success">Can you turn the sun green?</div>'
            + '<div class="alert alert-info">The functions <span class="inlineCode">sun</span> and <span class="inlineCode">moon</span> are'
            + ' actually a <b>wrapper</b> around the function <span class="inlineCode">orb</span> that passes a <b>parameter</b> to tell it what colour to draw the ball. You could make the sun any colour you like!'
            + '</div>',
    sampleCode: "orb('red');\n",
    testConditions: function(config) {
        return config.orb === 'green'
            && config.timeOfDay === 'day';
    },
    completionNotes: 'orb(\'green\');'
},{
    // An exercise
    title: 'Variable birds',
    helpText: '<div class="alert alert-success">Can you show 5 birds?</div>'
            + '<div class="alert alert-info">The variable <span class="inlineCode">birds</span> sets how many birds to show. You can show up to 6 birds.'
            + '</div>',
    sampleCode: "var birds = 3;\n",
    testConditions: function(config) {
        return config.birds === 5;
    },
    completionNotes: 'var birds = 5;'
},{
    // An exercise - this one tests to see if the user can show plant a tree
    // at a certain location
    title: 'Plant a tree',
    helpText: '<div class="alert alert-success">Can you plan a tree 100 pixels from the left and 160 pixels from the top?</div>'
        + '<div class="alert alert-info">You can plant a tree byusing the <b class="inlineCode">tree</b> function. You can tell the computer WHERE to plant the tree by using the parameters of tree.<br/><br/>The first parameter is how many pixels from the LEFT of the screen. The second parameter is how many pixels from the TOP of the screen.</div>',
    sampleCode: "tree(130, 100);\n",
    testConditions: function(config) {
        return config.treesPlanted > 0 && config.treePlantedAt100160;
    },
    completionNotes: 'tree(100, 160);'
},{
    // An exercise - this one tests to see if the user can show plant 5 trees
    // by calling a function multiple times
    title: 'Plant 5 trees',
    helpText: '<div class="alert alert-success">Can you plant 5 trees in different places?</div>'
        + '<div class="alert alert-info">The function <span class="inlineCode">tree</span>'
                + ' takes two <b>parameters</b>. They are both <b>whole numbers</b>. You can plant as many as you like!'
                + ' </div>',
    sampleCode: "tree(40, 150);\ntree(20, 170);\ntree(240, 110);\n",
    testConditions: function(config) {
        // make sure trees are planted in 5 unique locations
        return config.treesPlanted === 5 && config.treesPlantedInDifferentPlaces;
    },
    completionNotes: "tree(40, 150);"
},{
    // An exercise - can the user draw multiple trees in a loop?
    title: 'Loopy for trees',
    helpText: '<div class="alert alert-success">Can you plant 10 trees using a loop?</div>'
            + '<div class="alert alert-info">You can use a <span class="inlineCode">while</span> loop and a little bit of simple maths to draw a row of trees.'
            +  '</div>',
    sampleCode: "var treesToPlant = 4;"
            + "\nvar i = 0;"
            + "\nwhile (i < treesToPlant) {"
            + "\n    var left = i * (SCREEN_WIDTH / treesToPlant);"
            + "\n    tree(left, 180);"
            + "\n    i = i + 1;"
            + "\n}\n",
    testConditions: function(config) {
        // Note that the test conditions are not sophisticated enough to truly
        // detect that a loop has been used. In the interests of keeping the code
        // light, we didn't go too far with that
        return config.treesPlanted === 10;
    },
    completionNotes: "\nwhile (i < treesToPlant) { }"
},{
    // An exercise - can the user employ and adjust randomness?
    title: 'Random trees',
    helpText: '<div class="alert alert-success">Can you work out how to make tree placement more random?</div>'
                + '<div class="alert alert-info">We use a <b>constant</b>, <span class="inlineCode">SCREEN_WIDTH</span>, so we don\'t have to write \'400\' every time we want to specify the width of the scene.<br/><br/>'
                + ' You could try doing a few things like adjust the number of trees to plant, or'
                + ' adjusting the distance of each tree from the top. Here, we\'ve randomised them.',
    sampleCode: "var treesToPlant = 7;"
                + "\nvar randomness = 30;"
                + "\nvar i = 0;"
                + "\nwhile (i < treesToPlant) {"
                + "\n    var left = i * (SCREEN_WIDTH / treesToPlant);"
                + "\n    tree(left, 150 + Math.floor(Math.random() * randomness));"
                + "\n    i = i + 1;"
                + "\n}\n",
    testConditions: function(config) {
        // Note that the test conditions are not sophisticated enough to truly
        // detect that randomness has been used. In the interests of keeping the code
        // light, we didn't go too far with that
        return config.treesPlanted === 7;
    },
    completionNotes: 'Math.random()'
},{
    // An exercise - can the user make it night time?
    title: 'Make it night time!',
    helpText: '<div class="alert alert-success">Can you make it dark?</div>'
        + '<div class="alert alert-info"> You can make it night time by using the <b>function</b> <span class="inlineCode">settime</span> and using the <b>parameter</b> \'night\'.</div>'
        + '<div class="alert alert-warning">You need to make sure that <span class="inlinecode">settime</span> is used'
        + ' before any other code, otherwise it could end up being displayed on top of trees!'
        + ' This is because code runs in the order it is written in.</div>',
    sampleCode: "settime('night');\n",
    testConditions: function(config) {
        return config.timeOfDay === 'night';
    },
    completionNotes: "settime('night');"
},{
    // Free play - let the user loose on Canvas!
    title: 'Using Canvas',
    helpText: '<div class="alert alert-success">Can you change the colours? Can you add more colour stops?</div>'
        + '<div class="alert alert-info">Under the hood, the <span class="inlineCode">settime</span> function'
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
    },
    completionNotes: null
}];
