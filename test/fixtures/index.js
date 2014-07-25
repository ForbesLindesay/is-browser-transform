'use strict';

var IS_BROWSER = require('is-browser');

exports.isBrowser = IS_BROWSER;
exports.isServer = !require('is-browser');

exports.staticString = require('static-string');
exports.staticNumber = require('static-number');
exports.staticTrue = require('static-true');
exports.staticFalse = require('static-false');
