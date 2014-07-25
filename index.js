'use strict';

var assert = require('assert');
var TransformStream = require('stream').Transform;
var uglify = require('uglify-js');
var convert = require('convert-source-map');
var utils = require('./lib/utils.js');

module.exports = function (file, opts) {
  opts = opts || {};
  opts.filename = file;
  var stream = new TransformStream();
  var source = '';
  stream._transform = function (chunk, _, callback) {
    source += chunk;
    callback();
  };
  stream._flush = function (callback) {
    stream.push(transform(source, opts));
    callback();
  };
  return stream;
}

function transform(src, opts) {
  assert(typeof src === 'string', 'Source must be a string');

  var changed = false;

  var ast = uglify.parse(src)
  ast.figure_out_scope();
  ast = ast.transform(new uglify.TreeTransformer(null, function (node) {
    var from = utils.isRequire(node);
    if (from === 'is-browser') {
      changed = true;
      return new uglify.AST_True({});
    }
    if (from && opts.modules && Object.prototype.hasOwnProperty.call(opts.modules, from)) {
      var value = opts.modules[from];
      switch (typeof value) {
        case 'boolean':
          changed = true;
          return value ? new uglify.AST_True({}) : new uglify.AST_False({});
        case 'number':
          changed = true;
          return new uglify.AST_Number({value: value});
        case 'string':
          changed = true;
          return new uglify.AST_String({value: value});
      }
    }
  }));
  ast.figure_out_scope();
  var walker = new uglify.TreeWalker(function (node) {
    if (node.TYPE === 'SymbolRef') {
      node.parent = walker.parent();
    }
  });
  ast.walk(walker);
  ast = ast.transform(new uglify.TreeTransformer(null, function (node) {
    var value = utils.isConstant(node);
    if (value) return value;
  }));
  if (!changed) return src;

  var sourceMapsIn = /\/\/[#@] ?sourceMappingURL=data:application\/json;base64,([a-zA-Z0-9+\/]+)={0,2}$/.exec(src);
  var sourceMapOpts = {};
  sourceMapOpts.file = 'out.js.map';
  if (sourceMapsIn) {
    sourceMapOpts.orig = convert.fromJSON(
      new Buffer(sourceMapsIn[1], 'base64').toString()
    ).sourcemap;
  }
  var sourceMap = uglify.SourceMap(sourceMapOpts);
  var stream = uglify.OutputStream({
    beautify: true,
    comments: true,
    source_map: sourceMap
  });
  ast.print(stream);

  var map = convert.fromJSON(sourceMap);

  if (opts.filename) {
    map.setProperty('sources', [opts.filename]);
  }
  map.setProperty('sourcesContent', sourceMapOpts.orig
    ? sourceMapOpts.orig.sourcesContent
    : [src]
  );

  return stream.toString() + '\n' + map.toComment();
}
