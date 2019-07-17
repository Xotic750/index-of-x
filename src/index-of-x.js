import numberIsNaN from 'is-nan-x';
import isString from 'is-string';
import isFalsey from 'is-falsey-x';
import toObject from 'to-object-x';
import toLength from 'to-length-x';
import sameValueZero from 'same-value-zero-x';
import sameValue from 'same-value-x';
import findIndex from 'find-index-x';
import calcFromIndex from 'calculate-from-index-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import attempt from 'attempt-x';

let pIndexOf = typeof Array.prototype.indexOf === 'function' && Array.prototype.indexOf;

let isWorking;

if (pIndexOf) {
  let res = attempt.call([0, 1], pIndexOf, 1, 2);
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
    const testArr = [];
    testArr.length = 2;
    /* eslint-disable-next-line no-void */
    testArr[1] = void 0;
    /* eslint-disable-next-line no-void */
    res = attempt.call(testArr, pIndexOf, void 0);
    isWorking = res.threw === false && res.value === 1;
  }

  if (isWorking) {
    res = attempt.call('abc', pIndexOf, 'c');
    isWorking = res.threw === false && res.value === 2;
  }

  if (isWorking) {
    res = attempt.call(
      (function getArgs() {
        /* eslint-disable-next-line prefer-rest-params */
        return arguments;
      })('a', 'b', 'c'),
      pIndexOf,
      'c',
    );
    isWorking = res.threw === false && res.value === 2;
  }
}

if (isWorking !== true) {
  pIndexOf = function $pIndexOf(searchElement) {
    /* eslint-disable-next-line babel/no-invalid-this */
    const length = toLength(this.length);

    if (length < 1) {
      return -1;
    }

    /* eslint-disable-next-line prefer-rest-params */
    let i = arguments[1];
    while (i < length) {
      /* eslint-disable-next-line babel/no-invalid-this */
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
const findIdxFrom = function findIndexFrom(array, searchElement, fromIndex, extendFn) {
  let fIdx = fromIndex;
  const length = toLength(array.length);
  while (fIdx < length) {
    if (fIdx in array && extendFn(array[fIdx], searchElement)) {
      return fIdx;
    }

    fIdx += 1;
  }

  return -1;
};

// eslint-disable jsdoc/check-param-names
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
const indexOf = function indexOf(array, searchElement) {
  const object = toObject(array);
  const iterable = splitIfBoxedBug(object);
  const length = toLength(iterable.length);

  if (length < 1) {
    return -1;
  }

  const argLength = arguments.length;
  /* eslint-disable-next-line prefer-rest-params */
  let extend = argLength > 2 && argLength > 3 ? arguments[3] : arguments[2];
  let extendFn;

  if (isString(extend)) {
    extend = extend.toLowerCase();

    if (extend === 'samevalue') {
      extendFn = sameValue;
    } else if (extend === 'samevaluezero') {
      extendFn = sameValueZero;
    }
  }

  let fromIndex = 0;

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

    return findIndex(iterable, (element, index) => {
      return index in iterable && extendFn(searchElement, element);
    });
  }

  if (argLength > 3 || (argLength > 2 && isFalsey(extendFn))) {
    /* eslint-disable-next-line prefer-rest-params */
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

export default indexOf;
