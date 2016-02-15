/**
 * @file
 * <a href="https://travis-ci.org/Xotic750/index-of-x"
 * title="Travis status">
 * <img src="https://travis-ci.org/Xotic750/index-of-x.svg?branch=master"
 * alt="Travis status" height="18">
 * </a>
 * <a href="https://david-dm.org/Xotic750/index-of-x"
 * title="Dependency status">
 * <img src="https://david-dm.org/Xotic750/index-of-x.svg"
 * alt="Dependency status" height="18"/>
 * </a>
 * <a href="https://david-dm.org/Xotic750/index-of-x#info=devDependencies"
 * title="devDependency status">
 * <img src="https://david-dm.org/Xotic750/index-of-x/dev-status.svg"
 * alt="devDependency status" height="18"/>
 * </a>
 * <a href="https://badge.fury.io/js/index-of-x" title="npm version">
 * <img src="https://badge.fury.io/js/index-of-x.svg"
 * alt="npm version" height="18">
 * </a>
 *
 * An extended ES6 indexOf module.
 *
 * <h2>ECMAScript compatibility shims for legacy JavaScript engines</h2>
 * `es5-shim.js` monkey-patches a JavaScript context to contain all EcmaScript 5
 * methods that can be faithfully emulated with a legacy JavaScript engine.
 *
 * `es5-sham.js` monkey-patches other ES5 methods as closely as possible.
 * For these methods, as closely as possible to ES5 is not very close.
 * Many of these shams are intended only to allow code to be written to ES5
 * without causing run-time errors in older engines. In many cases,
 * this means that these shams cause many ES5 methods to silently fail.
 * Decide carefully whether this is what you want. Note: es5-sham.js requires
 * es5-shim.js to be able to work properly.
 *
 * `json3.js` monkey-patches the EcmaScript 5 JSON implimentation faithfully.
 *
 * `es6.shim.js` provides compatibility shims so that legacy JavaScript engines
 * behave as closely as possible to ECMAScript 6 (Harmony).
 *
 * @version 1.0.17
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module index-of-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:4, maxdepth:4,
  maxstatements:28, maxcomplexity:14 */

/*global require, module */

;(function () {
  'use strict';

  var pCharAt = String.prototype.charAt;
  var pIndexOf = Array.prototype.indexOf;
  var pPush = Array.prototype.push;
  var pfindIndex = Array.prototype.findIndex;
  var $abs = Math.abs;
  var $isNaN = Number.isNaN;
  var isString = require('is-string');
  var toInteger = require('to-integer-x');
  var toObject = require('to-object-x');
  var toLength = require('to-length-x');
  var sameValueZero = require('same-value-zero-x');
  var safeToString = require('safe-to-string-x');
  var sameValue = Object.is;

  /**
   * This method returns an index in the array, if an element in the array
   * satisfies the provided testing function. Otherwise -1 is returned.
   *
   * @private
   * @param {Array} object The array to search.
   * @param {*} searchElement Element to locate in the array.
   * @param {number} fromIndex The index to start the search at.
   * @param {Function} extendFn The comparison function to use.
   * @return {number} Returns index of found element, otherwise -1.
   */
  function findIndexFrom(object, searchElement, fromIndex, extendFn) {
    var isStr = isString(object);
    var length = toLength(object.length);
    while (fromIndex < length) {
      var element = isStr ? pCharAt.call(object, fromIndex) : object[fromIndex];
      if (fromIndex in object && extendFn(element, searchElement)) {
        return fromIndex;
      }
      fromIndex += 1;
    }
    return -1;
  }

  /**
   * This method returns the first index at which a given element can be found
   * in the array, or -1 if it is not present.
   *
   * @param {Array} array The array to search.
   * @throws {TypeError} If `array` is `null` or `undefined`.
   * @param {*} searchElement Element to locate in the `array`.
   * @param {number} [fromIndex] The index to start the search at. If the
   *  index is greater than or equal to the array's length, -1 is returned,
   *  which means the array will not be searched. If the provided index value is
   *  a negative number, it is taken as the offset from the end of the array.
   *  Note: if the provided index is negative, the array is still searched from
   *  front to back. If the calculated index is less than 0, then the whole
   *  array will be searched. Default: 0 (entire array is searched).
   * @param {string} [extend] Extension type: `SameValue` or `SameValueZero`.
   * @return {number} Returns index of found element, otherwise -1.
   * @example
   * var indexOf = require('index-of-x');
   * var subject = [2, 3, undefined, true, 'hej', null, 2, false, 0, -0, NaN];
   *
   * // Standard mode, operates just like `Array.prototype.indexOf`.
   * indexOf(subject, null); // 5
   * indexOf(testSubject, '2'); // -1
   * indexOf(testSubject, NaN); // -1
   * indexOf(testSubject, -0); // 8
   * indexOf(testSubject, 2, 2); //6
   *
   * // `SameValueZero` mode extends `indexOf` to match `NaN`.
   * indexOf(subject, null, 'SameValueZero'); // 5
   * indexOf(testSubject, '2', 'SameValueZero'); // -1
   * indexOf(testSubject, NaN, 'SameValueZero'); // 10
   * indexOf(testSubject, -0, 'SameValueZero'); // 8
   * indexOf(testSubject, 2, 2, 'SameValueZero'); //6
   *
   * // `SameValue` mode extends `indexOf` to match `NaN` and signed `0`.
   * indexOf(subject, null, 'SameValue'); // 5
   * indexOf(testSubject, '2', 'SameValue'); // -1
   * indexOf(testSubject, NaN, 'SameValue'); // 10
   * indexOf(testSubject, -0, 'SameValue'); // 9
   * indexOf(testSubject, 2, 2, 'SameValue'); //6
   */
  module.exports = function indexOf(array, searchElement) {
    var object = toObject(array);
    var length = toLength(object.length);
    if (!length) {
      return -1;
    }
    var args = [searchElement];
    var extend;
    if (arguments.length > 2) {
      if (arguments.length > 3) {
        pPush.call(args, arguments[2]);
        extend = arguments[3];
      } else if (isString(arguments[2])) {
        extend = safeToString(arguments[2]);
      }
    }
    var extendFn;
    if (extend === 'SameValue') {
      extendFn = sameValue;
    } else if (extend === 'SameValueZero') {
      extendFn = sameValueZero;
    }
    if (extendFn && (searchElement === 0 || $isNaN(searchElement))) {
      var fromIndex = toInteger(arguments[2]);
      if (fromIndex < length) {
        if (fromIndex < 0) {
          fromIndex = length - $abs(fromIndex);
          if (fromIndex < 0) {
            fromIndex = 0;
          }
        }
      }
      if (fromIndex > 0) {
        return findIndexFrom(object, searchElement, fromIndex, extendFn);
      }
      return pfindIndex.call(object, function (element, index) {
        return index in object && extendFn(searchElement, element);
      });
    }
    if (!extendFn && args.length === 1 && arguments.length === 3) {
      pPush.call(args, arguments[2]);
    }
    return pIndexOf.apply(object, args);
  };
}());
