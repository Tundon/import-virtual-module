// const requireFromString = require('require-from-string')

import Module from 'module'
import path from 'path'
import assert from 'assert'

function requireFromString(code, filename, opts) {
  if (typeof filename === 'object') {
		opts = filename;
		filename = undefined;
	}

	opts = opts || {};
	filename = filename || '';

	opts.appendPaths = opts.appendPaths || [];
	opts.prependPaths = opts.prependPaths || [];

	if (typeof code !== 'string') {
		throw new Error('code must be a string, not ' + typeof code);
	}

	var paths = Module._nodeModulePaths(path.dirname(filename));

	var parent = module.parent;
	var m = new Module(filename, parent);
	m.filename = filename;
	m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths);
  m._compile(code, filename);
  m.loaded = true

	// var exports = m.exports;
	parent && parent.children && parent.children.splice(parent.children.indexOf(m), 1);

	return m;
}

let module1 = requireFromString(`
export { sep } from 'path'
export class Empty {}
export { RealNumber } from '../src/real.js'
`, 
path.join(__dirname, 'virtuals/module1.js'))
// './virtuals/module1.js')
// module1.loaded = true
console.log(module1.exports)

let module2 = requireFromString(`
export { Empty } from './module1.js'
`, 
path.join(__dirname, 'virtuals/module2.js'))
// './virtuals/module2.js')
console.log(module2.exports)

// assert.strictEqual(require('./virtuals/module1.js'), module1)
// console.log(require('./virtuals/module1'))
