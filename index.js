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
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module index-of-x
 */

/*jslint maxlen:80, es6:true, white:true */

/*jshint bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
  freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
  nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
  es3:true, esnext:true, plusplus:true, maxparams:4, maxdepth:3,
  maxstatements:25, maxcomplexity:13 */

/*global require, module */

;(function () {
  'use strict';

  var ES = require('es-abstract/es6'),
    isString = require('is-string'),
    findIndex = require('find-index-x'),
    pIndexOf = Array.prototype.indexOf;
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
    var isStr = isString(object),
      length = ES.ToLength(object.length),
      element;
    while (fromIndex < length) {
      element = isStr ? object.charAt(fromIndex) : object[fromIndex];
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
  module.exports = function (array, searchElement) {
    var object = ES.ToObject(array),
      length = ES.ToLength(object.length),
      fromIndex, extend, extendFn;
    if (!length) {
      return -1;
    }
    fromIndex = arguments[2];
    if (arguments.length > 3) {
      extend = String(arguments[3]);
    } else if (arguments.length > 2) {
      if (isString(fromIndex)) {
        extend = String(fromIndex);
      }
    }
    if (extend === 'SameValue') {
      extendFn = ES.SameValue;
    } else if (extend === 'SameValueZero') {
      extendFn = ES.SameValueZero;
    }
    fromIndex = ES.ToInteger(fromIndex);
    if (fromIndex < length) {
      if (fromIndex < 0) {
        fromIndex = length - Math.abs(fromIndex);
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }
    }
    if (extendFn && (searchElement === 0 || searchElement !== searchElement)) {
      if (fromIndex > 0) {
        return findIndexFrom(object, searchElement, fromIndex, extendFn);
      }
      return findIndex(object, function (element, index) {
        return index in object && extendFn(searchElement, element);
      });
    }
    return pIndexOf.call(object, searchElement, fromIndex);
  };
}());
