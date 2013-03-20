/*global alert*/

// This file contains the predefined functions that people can call and play
// around with. The idea is that people get comfortable using functions then they
// can start writing functions of their own!

// how wide is the scree?
var SCREEN_WIDTH = 400;
var SCREEN_HEIGHT = 300;

// set up the drawing elements and draw a basic background
var canvas = document.getElementById('pane');
var context = canvas.getContext('2d');
var skyGrad = context.createLinearGradient(0,0,0,150);
skyGrad.addColorStop(0, '#66b6fc');
skyGrad.addColorStop(1, '#b2e1ff');
context.fillStyle = skyGrad;
context.fillRect(0, 0, SCREEN_WIDTH, 150);
var grassGrad = context.createLinearGradient(0,0,0,150);
grassGrad.addColorStop(0, '#cdeb8e');
grassGrad.addColorStop(1, '#a5c956');
context.fillStyle = grassGrad;
context.fillRect(0, 150, SCREEN_WIDTH, 300);

var testConditions = {
    'ballInSky': null,
    'timeOfDay': 'day',
    'treesPlanted': 0,
    'treePlantedAt100200': false,
    'valid': false // set in wrapper function in jscene.js.
                   // this is only set if the script appears to be syntax error free
};

// here are the custom functions!

/**
 * Can set the time of day to night
 * @param {String} time e.g. "nighShow the moon in the top right cornert"
 *
 * @returns {null}
 */
function setTimeOfDay(time) {
    if(time === 'night') {
        var skyGrad = context.createLinearGradient(0,0,0,150);
        skyGrad.addColorStop(0, '#000000');
        skyGrad.addColorStop(1, '#222222');
        context.fillStyle = skyGrad;
        context.fillRect(0, 0, SCREEN_WIDTH, 150);
    }
    testConditions.timeOfDay = time;
}

/**
 *
 * @param {int} left Number of pixels from the left of the screen to show the
 * tree
 * @param {int} top Number of pixels from the top of the screen to show the
 * tree
 *
 * @returns {null}
 */
function plantTree(left, top) {
    var treeTrunkWidth = 30;

    var grad = context.createLinearGradient(0,0,0,150);
    grad.addColorStop(0, '#a90329');
    grad.addColorStop(0.44, '#8f0222');
    grad.addColorStop(1, '#6d0019');
    context.fillStyle = grad;
    context.fillRect(left - (treeTrunkWidth / 2), top, treeTrunkWidth, 100);

    context.beginPath();
    var radius = 40;
    context.arc(left, top, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();

    testConditions.treePlantedAt100200 = (left === 100 && top === 200);
    testConditions.treesPlanted++;
}

/**
 * Show a ball in the top right corner (e.g. the sun)
 *
 * @param {String} colour A valid HTML colour e.g. "red"
 *
 * @returns {null}
 */
function showBallInSky(colour) {
    context.beginPath();
    var radius = 50;
    context.arc(SCREEN_WIDTH, 0, radius, 0, 2 * Math.PI, false);
    context.fillStyle = colour;
    context.fill();

    testConditions.ballInSky = colour;
}

/**
 * Show the sun in the top right corner
 *
 * @returns {null}
 */
function showSun() {
    showBallInSky('yellow');
}

/**
 * Show the moon in the top right corner
 *
 * @returns {null}
 */
function showMoon() {
    showBallInSky('lightgray');
}

/**
 * Can you find this?!
 *
 * @returns {null}
 */
function secret() {
    alert("You found the secret function! You have great promise! Keep it up! Tell the Box UK guys the code is 'D L N'");
}
