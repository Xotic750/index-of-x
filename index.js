/**
 * @file An extended ES6 indexOf.
 * @version 1.9.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module index-of-x
 */

'use strict';

var $isNaN = require('is-nan');
var isString = require('is-string');
var toInteger = require('to-integer-x');
var toObject = require('to-object-x');
var toLength = require('to-length-x');
var sameValueZero = require('same-value-zero-x');
var safeToString = require('safe-to-string-x');
var sameValue = require('object-is');
var findIndex = require('find-index-x');
var splitString = require('has-boxed-string-x') === false;
var pIndexOf = Array.prototype.indexOf;

if (typeof pIndexOf !== 'function' || [0, 1].indexOf(1, 2) !== -1) {
  pIndexOf = function indexOf(searchElement) {
    // eslint-disable-next-line no-invalid-this
    var length = this.length;
    var i = arguments.length > 1 ? toInteger(arguments[1]) : 0;
    // handle negative indices
    i = i >= 0 ? i : Math.max(0, length + i);
    while (i < length) {
      // eslint-disable-next-line no-invalid-this
      if (i in this && this[i] === searchElement) {
        return i;
      }

      i += 1;
    }

    return -1;
  };
}

/**
 * This method returns an index in the array, if an element in the array
 * satisfies the provided testing function. Otherwise -1 is returned.
 *
 * @private
 * @param {Array} array - The array to search.
 * @param {*} searchElement - Element to locate in the array.
 * @param {number} fromIndex - The index to start the search at.
 * @param {Function} extendFn - The comparison function to use.
 * @returns {number} Returns index of found element, otherwise -1.
 */
// eslint-disable-next-line max-params
var findIdxFrom = function findIndexFrom(array, searchElement, fromIndex, extendFn) {
  var fIdx = fromIndex;
  var length = array.length;
  while (fIdx < length) {
    if (fIdx in array && extendFn(array[fIdx], searchElement)) {
      return fIdx;
    }

    fIdx += 1;
  }

  return -1;
};

/**
 * This method returns the first index at which a given element can be found
 * in the array, or -1 if it is not present.
 *
 * @param {Array} array - The array to search.
 * @throws {TypeError} If `array` is `null` or `undefined`.
 * @param {*} searchElement - Element to locate in the `array`.
 * @param {number} [fromIndex] - The index to start the search at. If the
 *  index is greater than or equal to the array's length, -1 is returned,
 *  which means the array will not be searched. If the provided index value is
 *  a negative number, it is taken as the offset from the end of the array.
 *  Note: if the provided index is negative, the array is still searched from
 *  front to back. If the calculated index is less than 0, then the whole
 *  array will be searched. Default: 0 (entire array is searched).
 * @param {string} [extend] - Extension type: `SameValue` or `SameValueZero`.
 * @returns {number} Returns index of found element, otherwise -1.
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
  var iterable = splitString && isString(object) ? object.split('') : object;
  var length = toLength(iterable.length);
  if (length < 1) {
    return -1;
  }

  var args = [searchElement];
  var extend;
  if (arguments.length > 2) {
    if (arguments.length > 3) {
      args[1] = arguments[2];
      extend = arguments[3];
    } else if (isString(arguments[2])) {
      extend = safeToString(arguments[2]);
    }
  }

  var extendFn;
  if (isString(extend)) {
    extend = extend.toLowerCase();
    if (extend === 'samevalue') {
      extendFn = sameValue;
    } else if (extend === 'samevaluezero') {
      extendFn = sameValueZero;
    }
  }

  if (extendFn && (searchElement === 0 || $isNaN(searchElement))) {
    var fromIndex = toInteger(arguments[2]);
    if (fromIndex < length) {
      if (fromIndex < 0) {
        fromIndex = length - Math.abs(fromIndex);
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }
    }

    if (fromIndex > 0) {
      return findIdxFrom(iterable, searchElement, fromIndex, extendFn);
    }

    return findIndex(iterable, function (element, index) {
      return index in iterable && extendFn(searchElement, element);
    });
  }

  if (Boolean(extendFn) === false && args.length === 1 && arguments.length > 2) {
    args[1] = arguments[2];
  }

  return pIndexOf.apply(iterable, args);
};
