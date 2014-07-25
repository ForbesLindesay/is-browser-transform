# is-browser-transform

Static browserify transform for "is-browser" npm module.  Perfect to run just before the [uglifyify](https://github.com/hughsk/uglifyify) transform and in conjunction with the [envify](https://github.com/hughsk/envify) transform.

[![Build Status](https://img.shields.io/travis/ForbesLindesay/is-browser-transform/master.svg)](https://travis-ci.org/ForbesLindesay/is-browser-transform)
[![Dependency Status](https://img.shields.io/gemnasium/ForbesLindesay/is-browser-transform.svg)](https://gemnasium.com/ForbesLindesay/is-browser-transform)
[![NPM version](https://img.shields.io/npm/v/is-browser-transform.svg)](https://www.npmjs.org/package/is-browser-transform)

## Installation

    npm install is-browser-transform

## Basic Usage

To replace all instances of `require('is-browser')` with the literal `true`.

```
browserify -g is-browser-transform ./index.js > bundle.js
```

or

```js
var browserify = require('browserify')
var fs = require('fs')

var bundler = browserify(__dirname + '/index.js')

bundler.transform({
  global: true
}, require('is-browser-transform'))

bundler.bundle()
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'))
```

## Advanced Usage

To replace all instances of `require('is-browser')` with the literal `true` and replace all instances of `require('the-answer-to-everything')` with the literal `42`:

```js
var browserify = require('browserify')
var fs = require('fs')

var bundler = browserify(__dirname + '/index.js')

bundler.transform({
  global: true,
  modules: { 'the-answer-to-everything': 42 }
}, require('is-browser-transform'))

bundler.bundle()
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'))
```

This module understands strings, numbers and booleans as constant values of modules.

## License

  MIT
