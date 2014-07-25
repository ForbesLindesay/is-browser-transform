'use strict';

var fs = require('fs');
var assert = require('assert');
var rm = require('rimraf').sync;
var mk = require('mkdirp').sync;
var isBrowserTransform = require('../');

rm(__dirname + '/output');
mk(__dirname + '/output');

var source = fs.createReadStream(__dirname + '/fixtures/index.js');
var transform = isBrowserTransform(__dirname + '/fixtures/index.js', {
  modules: {
    'static-string': 'Hello World',
    'static-number': 42,
    'static-true': true,
    'static-false': false
  }
});
var dest = fs.createWriteStream(__dirname + '/output/index.js');

source.pipe(transform).pipe(dest);

dest.on('close', function () {
  var m = require('./output/index.js');
  assert(m.trickedYou === false);
  assert(m.isBrowser === true);
  assert(m.isServer === false);
  assert(m.staticString === 'Hello World');
  assert(m.staticNumber === 42);
  assert(m.staticTrue === true);
  assert(m.staticFalse === false);
  console.log(fs.readFileSync(__dirname + '/output/index.js', 'utf8').split('//')[0]);
});
