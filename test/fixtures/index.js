'use strict';

var IS_BROWSER = require('is-browser');
var IS_SERVER = !require('is-browser');

var trickedYou = true;
trickedYou = false;
exports.trickedYou = trickedYou;
var trickedAgain = 0;
trickedAgain++;
exports.trickedAgain = trickedAgain;

exports.isBrowser = IS_BROWSER;
exports.isServer = IS_SERVER;

exports.staticString = require('static-string');
exports.staticNumber = require('static-number');
exports.staticTrue = require('static-true');
exports.staticFalse = require('static-false');
