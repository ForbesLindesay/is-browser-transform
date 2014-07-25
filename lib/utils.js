'use strict';

var assert = require('assert');

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

exports.isRequireResult = isRequireResult;
function isRequireResult(node) {
  assert(node != null, 'node should not be null');
  if (isRequire(node)) {
    return node.args[0].value;
  } else if (node.TYPE === 'SymbolRef' && node.thedef && node.thedef.init) {
    return isRequireResult(node.thedef.init);
  } else {
    return false;
  }
}

exports.isGlobal = isGlobal;
function isGlobal(node) {
  assert(node != null, 'node should not be null');
  if (node.TYPE === 'SymbolRef' && node.thedef && node.thedef.global && node.thedef.undeclared) {
    return node.name;
  } else if (node.TYPE === 'SymbolRef' && node.thedef && node.thedef.init) {
    return isGlobal(node.thedef.init);
  } else {
    return false;
  }
}
