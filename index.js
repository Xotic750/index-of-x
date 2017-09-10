/**
 * @file An extended ES6 indexOf.
 * @version 2.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module index-of-x
 */

'use strict';

var numberIsNaN = require('is-nan-x');
var isString = require('is-string');
var isFalsey = require('is-falsey-x');
var toObject = require('to-object-x');
var toLength = require('to-length-x');
var sameValueZero = require('same-value-zero-x');
var sameValue = require('same-value-x');
var findIndex = require('find-index-x');
var calcFromIndex = require('calculate-from-index-x');
var splitIfBoxedBug = require('split-if-boxed-bug-x');
var pIndexOf = typeof Array.prototype.indexOf === 'function' && Array.prototype.indexOf;

var isWorking;
if (pIndexOf) {
  var attempt = require('attempt-x');
  var res = attempt.call([0, 1], pIndexOf, 1, 2);
  isWorking = res.threw === false && res.value === -1;

  if (isWorking) {
    res = attempt.call([0, 1], pIndexOf, 1);
    isWorking = res.threw === false && res.value === 1;
  }

  if (isWorking) {
    res = attempt.call([0, -0], pIndexOf, -0);
    isWorking = res.threw === false && res.value === 0;
  }

  if (isWorking) {
    var testArr = [];
    testArr.length = 2;
    testArr[1] = void 0;
    res = attempt.call(testArr, pIndexOf, void 0);
    isWorking = res.threw === false && res.value === 1;
  }

  if (isWorking) {
    res = attempt.call('abc', pIndexOf, 'c');
    isWorking = res.threw === false && res.value === 2;
  }

  if (isWorking) {
    res = attempt.call((function () {
      return arguments;
    }('a', 'b', 'c')), pIndexOf, 'c');
    isWorking = res.threw === false && res.value === 2;
  }
}

// eslint-disable-next-line no-console
console.log(isWorking);
if (isWorking !== true) {
  pIndexOf = function indexOf(searchElement) {
    // eslint-disable-next-line no-invalid-this
    var length = toLength(this.length);
    if (length < 1) {
      return -1;
    }

    var i = arguments[1];
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
  var length = toLength(array.length);
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
  var iterable = splitIfBoxedBug(object);
  var length = toLength(iterable.length);
  if (length < 1) {
    return -1;
  }

  var argLength = arguments.length;
  var extend = argLength > 2 && argLength > 3 ? arguments[3] : arguments[2];
  var extendFn;
  if (isString(extend)) {
    extend = extend.toLowerCase();
    if (extend === 'samevalue') {
      extendFn = sameValue;
    } else if (extend === 'samevaluezero') {
      extendFn = sameValueZero;
    }
  }

  var fromIndex = 0;
  if (extendFn && (searchElement === 0 || numberIsNaN(searchElement))) {
    if (argLength > 3) {
      fromIndex = calcFromIndex(iterable, arguments[2]);
      if (fromIndex >= length) {
        return -1;
      }

      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }

    if (fromIndex > 0) {
      return findIdxFrom(iterable, searchElement, fromIndex, extendFn);
    }

    return findIndex(iterable, function (element, index) {
      return index in iterable && extendFn(searchElement, element);
    });
  }

  if (argLength > 3 || (argLength > 2 && isFalsey(extendFn))) {
    fromIndex = calcFromIndex(iterable, arguments[2]);
    if (fromIndex >= length) {
      return -1;
    }

    if (fromIndex < 0) {
      fromIndex = 0;
    }
  }

  return pIndexOf.call(iterable, searchElement, fromIndex);
};
