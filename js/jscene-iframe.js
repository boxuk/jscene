/*global alert, birds*/

// This code gets included in the iframe "preview" panel
//
// This file contains the predefined functions that people can call and play
// around with. The idea is that people get comfortable using functions then they
// can start writing functions of their own!
/* JScene Scene Creator */

// Set up the width and height of the screen
var SCREEN_WIDTH = 400;
var SCREEN_HEIGHT = 300;

// set up the drawing elements and draw a basic skybox with a blue sky gradient
var canvas = document.getElementById('pane');
var context = canvas.getContext('2d');
var grassGrad = context.createLinearGradient(0,0,0,150);
grassGrad.addColorStop(0, '#cdeb8e');
grassGrad.addColorStop(1, '#a5c956');
context.fillStyle = grassGrad;
context.fillRect(0, 150, SCREEN_WIDTH, 300);

// Set up the test conditions. When the user updates their code
// in the CodeMirror input area, these test conditions are updated
// and sent back to the top-level page. This way, we can determine
// whether the user has completed the exercise and if so we can move
// on to the next exercise. This is a JavaScript value object - it is
// basically a set of keys which relate to values.
var testConditions = {
    'orb': null,
    'timeOfDay': null,
    'treesPlanted': 0,
    'treePlantedAt100200': false,
    'valid': false, // set in wrapper function in jscene.js.
                   // this is only set if the script appears to be syntax error free
    'birds': 0,
    'treesPlantedInDifferentPlaces': true
};

// here are the custom functions! These can be called by the user at any
// time from their code. The order the function are called in determines which
// elements are "layered" on top of one another - so, if you were to call:
//
//     showTree(100,100);
//     settime(night);
//
// then the night sky would overlap the trees!

/* Custom functions */

// This function allows the user to set the time of day to night
// time. The only time it supports is 'night' because 'day' mode
// is drawn by default.

/**
 * Can set the time of day to night
 * @param {String} time e.g. "nighShow the moon in the top right cornert"
 *
 * @returns {null}
 */
function settime(time) {
    var skyGrad = context.createLinearGradient(0,0,0,150);
    if(time === 'night') {
        skyGrad.addColorStop(0, '#000000');
        skyGrad.addColorStop(1, '#222222');

    } else {
        skyGrad.addColorStop(0, '#66b6fc');
        skyGrad.addColorStop(1, '#b2e1ff');

    }
    context.fillStyle = skyGrad;
    context.fillRect(0, 0, SCREEN_WIDTH, 150);

    testConditions.timeOfDay = time;
}

// Make sure that the time of day has been set
settime('day');

// This function allows the user to plant a tree. The user can specify where the tree
// is planted.

var plantedTreeLocations = [];

/**
 * Plant a tree - render a tree on the screen
 *
 * @param {int} left Number of pixels from the left of the screen to show the
 * tree
 * @param {int} top Number of pixels from the top of the screen to show the
 * tree
 *
 * @returns {null}
 */
function tree(left, top) {
    var treeTrunkWidth = 30;

    // Draw the trunk
    // Create a gradient with 3 colour stops
    var grad = context.createLinearGradient(0,0,0,150);
    grad.addColorStop(0, '#a90329');
    grad.addColorStop(0.44, '#8f0222');
    grad.addColorStop(1, '#6d0019');

    // draw that gradient in a rectangle on the canvas
    context.fillStyle = grad;
    context.fillRect(left - (treeTrunkWidth / 2), top, treeTrunkWidth, 100);

    // Draw a circle for the leafy part of the tree
    var radius = 40;
    context.beginPath();
    context.arc(left, top, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();

    // Update the test conditions so that jscene.js can figure out whether or
    // not the user has "passed" certain exercises
    testConditions.treePlantedAt100200 = (left === 100 && top === 200);
    testConditions.treesPlanted++;

    for(var i = 0; i < plantedTreeLocations.length; i++) {
        if(plantedTreeLocations[i][0] === left
            && plantedTreeLocations[i][1] === top) {
            testConditions.treesPlantedInDifferentPlaces = false;
        }
    }
    plantedTreeLocations.push([left, top]);
}

// Function that can display a quarter of a ball in the top right
// corner of the user's preview window. The user can specify a colour for this
// ball
//
// See also sun and moon, which are wrappers for this function

/**
 * Show a ball in the top right corner (e.g. the sun)
 *
 * @param {String} colour A valid HTML colour e.g. "red" or "#FF0000"
 *
 * @returns {null}
 */
function orb(colour) {
    context.beginPath();
    var radius = 50;
    context.arc(SCREEN_WIDTH, 0, radius, 0, 2 * Math.PI, false);
    context.fillStyle = colour;
    context.fill();

    testConditions.orb = colour;
}

// Function to draw the sun. This function is a wrapper of orb

/**
 * Show the sun in the top right corner
 *
 * @returns {null}
 */
function sun() {
    orb('yellow');
}

// Function to draw the moon. This function is a wrapper of orb

/**
 * Show the moon in the top right corner
 *
 * @returns {null}
 */
function moon() {
    orb('lightgray');
}

// A secret function! If users are playing around, perhaps they'll find this
// function!

/**
 * Can you find this?!
 *
 * @returns {null}
 */
function secret() {
    alert("You found the secret function! You have great promise! Keep it up! Tell the Box UK guys the code is 'D L N'");
}

function drawBird(i) {
    var startX = (i * 60) + 10;
    var startY = ((i % 3)  * 10) + 40 ;

    context.strokeStyle = "#222222";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(startX + 20, startY + 10);
    context.lineTo(startX + 40, startY);
    context.stroke();
}

// Support ctx as an alias for context. This makes some online
// examples easier to paste.
var ctx = context;