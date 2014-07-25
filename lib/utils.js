'use strict';

var assert = require('assert');
var uglify = require('uglify-js');

exports.isRequire = isRequire;
function isRequire(node) {
  assert(node != null, 'node should not be null');
  return (node.TYPE === 'Call' &&
      node.expression.TYPE === 'SymbolRef' &&
      node.expression.name === 'require' &&
      node.expression.thedef.global === true &&
      node.expression.thedef.undeclared === true &&
      node.args.length === 1 &&
      node.args[0].TYPE === 'String') ? node.args[0].value : false;
}

exports.isConstant = isConstant;
function isConstant(node) {
  if (node.TYPE == 'String' || node.TYPE === 'Number' ||
      node.TYPE === 'True' || node.TYPE === 'False') {
    return node;
  }

  if (node.TYPE === 'UnaryPrefix' && node.operator === '!') {
    var val = isConstant(node.expression);
    if (val) {
      if (val.TYPE === 'True') {
        return new uglify.AST_False({});
      } else if (val.TYPE === 'False') {
        return new uglify.AST_True({});
      }
    }
  }

  if (node.TYPE === 'SymbolRef' && node.thedef && node.thedef.init) {
    // check references to ensure that this is never modified
    var references = node.thedef.references;
    for (var i = 0; i < references.length; i++) {
      var ref = references[i];
      if (modifies(ref.parent, ref)) return;
    }
    return isConstant(node.thedef.init);
  }
}

exports.modifies = modifies;
function modifies(node, reference) {
  if (node.TYPE === 'Assign' && node.left === reference) return true;
  if (node.TYPE === 'UnaryPrefix' || node.TYPE === 'UnaryPostfix') return true;
}
