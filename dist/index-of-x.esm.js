function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

import numberIsNaN from 'is-nan-x';
import isString from 'is-string';
import toObject from 'to-object-x';
import toLength from 'to-length-x';
import sameValueZero from 'same-value-zero-x';
import sameValue from 'same-value-x';
import findIndex from 'find-index-x';
import calcFromIndex from 'calculate-from-index-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import attempt from 'attempt-x';
import toBoolean from 'to-boolean-x';
import methodize from 'simple-methodize-x';
import toInteger from 'to-integer-x';
var nio = [].indexOf;
var nativeIndexOf = typeof nio === 'function' && methodize(nio);
var mathMax = Math.max;

var test1 = function test1() {
  var res = attempt(nativeIndexOf, [0, 1], 1, 2);
  return res.threw === false && res.value === -1;
};

var test2 = function test2() {
  var res = attempt(nativeIndexOf, [0, 1], 1);
  return res.threw === false && res.value === 1;
};

var test3 = function test3() {
  var res = attempt(nativeIndexOf, [0, -0], -0);
  return res.threw === false && res.value === 0;
};

var test4 = function test4() {
  var testArr = [];
  testArr.length = 2;
  /* eslint-disable-next-line no-void */

  testArr[1] = void 0;
  /* eslint-disable-next-line no-void */

  var res = attempt(nativeIndexOf, testArr, void 0);
  return res.threw === false && res.value === 1;
};

var test5 = function test5() {
  var res = attempt(nativeIndexOf, 'abc', 'c');
  return res.threw === false && res.value === 2;
};

var test6 = function test6() {
  var args = function getArgs() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments;
  }('a', 'b', 'c');

  var res = attempt(nativeIndexOf, args, 'c');
  return res.threw === false && res.value === 2;
};

var isWorking = toBoolean(nativeIndexOf) && test1() && test2() && test3() && test4() && test5() && test6();
export var implementation = function indexOf(array, searchElement) {
  var object = toObject(array); // If no callback function or if callback is not a callable function

  var iterable = splitIfBoxedBug(object);
  var length = toLength(iterable.length);

  if (length === 0) {
    return -1;
  }

  var i = 0;

  if (arguments.length > 2) {
    /* eslint-disable-next-line prefer-rest-params */
    i = toInteger(arguments[2]);
  } // handle negative indices


  i = i >= 0 ? i : mathMax(0, length + i);

  for (; i < length; i += 1) {
    if (i in iterable && iterable[i] === searchElement) {
      return i;
    }
  }

  return -1;
};
var pIndexOf = isWorking ? nativeIndexOf : implementation;
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
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

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
 */
// eslint-enable jsdoc/check-param-names


var indexOf = function indexOf(array, searchElement) {
  var _this = this;

  var object = toObject(array);
  var iterable = splitIfBoxedBug(object);
  var length = toLength(iterable.length);

  if (length < 1) {
    return -1;
  }

  var argLength = arguments.length;
  /* eslint-disable-next-line prefer-rest-params */

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
      /* eslint-disable-next-line prefer-rest-params */
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
      _newArrowCheck(this, _this);

      return index in iterable && extendFn(searchElement, element);
    }.bind(this));
  }

  if (argLength > 3 || argLength > 2 && toBoolean(extendFn) === false) {
    /* eslint-disable-next-line prefer-rest-params */
    fromIndex = calcFromIndex(iterable, arguments[2]);

    if (fromIndex >= length) {
      return -1;
    }

    if (fromIndex < 0) {
      fromIndex = 0;
    }
  }

  return pIndexOf(iterable, searchElement, fromIndex);
};

export default indexOf;

//# sourceMappingURL=index-of-x.esm.js.map