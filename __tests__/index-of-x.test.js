import indexOf from '../src/index-of-x';

// IE 6 - 8 have a bug where this returns false.
const canDistinguish = 0 in [undefined];
const ifHasDenseUndefinedsIt = canDistinguish ? it : xit;
const undefinedIfNoSparseBug = canDistinguish
  ? undefined
  : {
      valueOf() {
        return 0;
      },
    };

const itHasDoc = typeof document !== 'undefined' && document ? it : xit;

describe('indexOf', function() {
  let testSubject;

  beforeEach(function() {
    testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, 2, false, 0, -0, NaN];
    delete testSubject[1];
  });

  it('is a function', function() {
    expect.assertions(1);
    expect(typeof indexOf).toBe('function');
  });

  it('should throw when target is null or undefined', function() {
    expect.assertions(3);
    expect(function() {
      indexOf();
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      indexOf(void 0);
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      indexOf(null);
    }).toThrowErrorMatchingSnapshot();
  });

  it('should find the element', function() {
    expect.assertions(1);
    const expected = 4;
    const actual = indexOf(testSubject, 'hej');
    expect(actual).toBe(expected);
  });

  it('should not find the element', function() {
    expect.assertions(1);
    const expected = -1;
    const actual = indexOf(testSubject, 'mus');
    expect(actual).toBe(expected);
  });

  ifHasDenseUndefinedsIt('should find undefined as well', function() {
    expect.assertions(1);
    const expected = -1;
    const actual = indexOf(testSubject, undefined);
    expect(actual).not.toBe(expected);
  });

  ifHasDenseUndefinedsIt('should skip unset indexes', function() {
    expect.assertions(1);
    const expected = 2;
    const actual = indexOf(testSubject, undefined);
    expect(actual).toBe(expected);
  });

  it('should use a strict test', function() {
    expect.assertions(4);
    let actual = indexOf(testSubject, null);
    expect(actual).toBe(5);

    actual = indexOf(testSubject, '2');
    expect(actual).toBe(-1);

    actual = indexOf(testSubject, NaN);
    expect(actual).toBe(-1);

    actual = indexOf(testSubject, -0);
    expect(actual).toBe(8);
  });

  it('should skip the first if fromIndex is set', function() {
    expect.assertions(3);
    expect(indexOf(testSubject, 2, 2)).toBe(6);
    expect(indexOf(testSubject, 2, 0)).toBe(0);
    expect(indexOf(testSubject, 2, 6)).toBe(6);
  });

  it('should work with negative fromIndex', function() {
    expect.assertions(3);
    expect(indexOf(testSubject, 2, -5)).toBe(6);
    expect(indexOf(testSubject, 2, -11)).toBe(0);
    expect(indexOf(testSubject, 2, -Infinity)).toBe(0);
  });

  it('should work with fromIndex being greater than the length', function() {
    expect.assertions(2);
    expect(indexOf(testSubject, 0, 20)).toBe(-1);
    expect(indexOf(testSubject, 0, Infinity)).toBe(-1);
  });

  it('should work with fromIndex being negative and greater than the length', function() {
    expect.assertions(1);
    expect(indexOf(testSubject, 'hej', -20)).toBe(4);
  });

  it('should work with object items', function() {
    expect.assertions(6);
    const a = [];
    const b = {};
    const c = new Date();
    const arr = [a, b, c];
    expect(indexOf(arr, a)).toBe(0);
    expect(indexOf(arr, b)).toBe(1);
    expect(indexOf(arr, c)).toBe(2);
    expect(indexOf(arr, [])).toBe(-1);
    expect(indexOf(arr, {})).toBe(-1);
    expect(indexOf(arr, new Date())).toBe(-1);
  });

  describe('array-like', function ArrayLike() {
    let testAL;

    beforeEach(function beforeEach() {
      testAL = {};
      testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, 2, false, 0, -0, NaN];
      testSubject.forEach(function(o, i) {
        testAL[i] = o;
      });
      testAL.length = testSubject.length;
    });

    it('should find the element (array-like)', function() {
      expect.assertions(1);
      const expected = 4;
      const actual = indexOf(testAL, 'hej');
      expect(actual).toBe(expected);
    });

    it('should not find the element (array-like)', function() {
      expect.assertions(1);
      const expected = -1;
      const actual = indexOf(testAL, 'mus');
      expect(actual).toBe(expected);
    });

    ifHasDenseUndefinedsIt('should find undefined as well (array-like)', function() {
      expect.assertions(1);
      const expected = -1;
      const actual = indexOf(testAL, undefined);
      expect(actual).not.toBe(expected);
    });

    ifHasDenseUndefinedsIt('should skip unset indexes (array-like)', function() {
      expect.assertions(1);
      const expected = 2;
      const actual = indexOf(testAL, undefined);
      expect(actual).toBe(expected);
    });

    it('should use a strict test (array-like)', function() {
      expect.assertions(2);
      let actual = indexOf(testAL, null);
      expect(actual).toBe(5);

      actual = indexOf(testAL, '2');
      expect(actual).toBe(-1);
    });

    it('should skip the first if fromIndex is set (array-like)', function() {
      expect.assertions(3);
      expect(indexOf(testAL, 2, 2)).toBe(6);
      expect(indexOf(testAL, 2, 0)).toBe(0);
      expect(indexOf(testAL, 2, 6)).toBe(6);
    });

    it('should work with negative fromIndex (array-like)', function() {
      expect.assertions(2);
      expect(indexOf(testAL, 2, -5)).toBe(6);
      expect(indexOf(testAL, 2, -11)).toBe(0);
    });

    it('should work with fromIndex being greater than the length (array-like)', function() {
      expect.assertions(1);
      expect(indexOf(testAL, 0, 20)).toBe(-1);
    });

    it('should work with fromIndex being negative and greater than the length (array-like)', function() {
      expect.assertions(1);
      expect(indexOf(testAL, 'hej', -20)).toBe(4);
    });

    it('should work with strings', function() {
      expect.assertions(1);
      expect(indexOf('abc', 'b')).toBe(1);
    });

    it('should work with arguments', function() {
      expect.assertions(1);
      const obj = (function getArgs() {
        return arguments;
      })('a', 'b', 'c');

      expect(indexOf(obj, 'b')).toBe(1);
    });

    itHasDoc('should work wih DOM elements', function() {
      expect.assertions(1);
      const fragment = document.createDocumentFragment();
      const div = document.createElement('div');
      fragment.appendChild(div);
      expect(indexOf(fragment.childNodes, div)).toBe(0);
    });
  });
});

describe('indexOf: SameValueZero', function() {
  let testSubject;

  beforeEach(function() {
    testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, 2, false, 0, -0, NaN];
    delete testSubject[1];
  });

  it('should find the element', function() {
    expect.assertions(1);
    const expected = 4;
    const actual = indexOf(testSubject, 'hej', 'SameValueZero');
    expect(actual).toBe(expected);
  });

  it('should not find the element', function() {
    expect.assertions(1);
    const expected = -1;
    const actual = indexOf(testSubject, 'mus', 'SameValueZero');
    expect(actual).toBe(expected);
  });

  ifHasDenseUndefinedsIt('should find undefined as well', function() {
    expect.assertions(1);
    const expected = -1;
    const actual = indexOf(testSubject, undefined, 'SameValueZero');
    expect(actual).not.toBe(expected);
  });

  ifHasDenseUndefinedsIt('should skip unset indexes', function() {
    expect.assertions(1);
    const expected = 2;
    const actual = indexOf(testSubject, undefined, 'SameValueZero');
    expect(actual).toBe(expected);
  });

  it('should use a SameValueZero test', function() {
    expect.assertions(4);
    let actual = indexOf(testSubject, null, 'SameValueZero');
    expect(actual).toBe(5);

    actual = indexOf(testSubject, '2', 'SameValueZero');
    expect(actual).toBe(-1);

    actual = indexOf(testSubject, NaN, 'SameValueZero');
    expect(actual).toBe(10);

    actual = indexOf(testSubject, -0, 'SameValueZero');
    expect(actual).toBe(8);
  });

  it('should skip the first if fromIndex is set', function() {
    expect.assertions(3);
    expect(indexOf(testSubject, 2, 2, 'SameValueZero')).toBe(6);
    expect(indexOf(testSubject, 2, 0, 'SameValueZero')).toBe(0);
    expect(indexOf(testSubject, 2, 6, 'SameValueZero')).toBe(6);
  });

  it('should work with negative fromIndex', function() {
    expect.assertions(2);
    expect(indexOf(testSubject, 2, -5, 'SameValueZero')).toBe(6);
    expect(indexOf(testSubject, 2, -11, 'SameValueZero')).toBe(0);
  });

  it('should work with fromIndex being greater than the length', function() {
    expect.assertions(1);
    expect(indexOf(testSubject, 0, 20, 'SameValueZero')).toBe(-1);
  });

  it('should work with fromIndex being negative and greater than the length', function() {
    expect.assertions(1);
    expect(indexOf(testSubject, 'hej', -20, 'SameValueZero')).toBe(4);
  });

  it('should work with object items', function() {
    expect.assertions(6);
    const a = [];
    const b = {};
    const c = new Date();
    const arr = [a, b, c];
    expect(indexOf(arr, a, 'SameValueZero')).toBe(0);
    expect(indexOf(arr, b, 'SameValueZero')).toBe(1);
    expect(indexOf(arr, c, 'SameValueZero')).toBe(2);
    expect(indexOf(arr, [], 'SameValueZero')).toBe(-1);
    expect(indexOf(arr, {}, 'SameValueZero')).toBe(-1);
    expect(indexOf(arr, new Date(), 'SameValueZero')).toBe(-1);
  });

  describe('array-like', function ArrayLike() {
    let testAL;

    beforeEach(function beforeEach() {
      testAL = {};
      testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, 2, false, 0, -0, NaN];
      testSubject.forEach(function(o, i) {
        testAL[i] = o;
      });
      testAL.length = testSubject.length;
    });

    it('should find the element (array-like)', function() {
      expect.assertions(1);
      const expected = 4;
      const actual = indexOf(testAL, 'hej', 'SameValueZero');
      expect(actual).toBe(expected);
    });

    it('should not find the element (array-like)', function() {
      expect.assertions(1);
      const expected = -1;
      const actual = indexOf(testAL, 'mus', 'SameValueZero');
      expect(actual).toBe(expected);
    });

    ifHasDenseUndefinedsIt('should find undefined as well (array-like)', function() {
      expect.assertions(1);
      const expected = -1;
      const actual = indexOf(testAL, undefined, 'SameValueZero');
      expect(actual).not.toBe(expected);
    });

    ifHasDenseUndefinedsIt('should skip unset indexes (array-like)', function() {
      expect.assertions(1);
      const expected = 2;
      const actual = indexOf(testAL, undefined, 'SameValueZero');
      expect(actual).toBe(expected);
    });

    it('should use a SameValueZero test (array-like)', function() {
      expect.assertions(2);
      let actual = indexOf(testAL, null, 'SameValueZero');
      expect(actual).toBe(5);

      actual = indexOf(testAL, '2', 'SameValueZero');
      expect(actual).toBe(-1);
    });

    it('should skip the first if fromIndex is set (array-like)', function() {
      expect.assertions(3);
      expect(indexOf(testAL, 2, 2, 'SameValueZero')).toBe(6);
      expect(indexOf(testAL, 2, 0, 'SameValueZero')).toBe(0);
      expect(indexOf(testAL, 2, 6, 'SameValueZero')).toBe(6);
    });

    it('should work with negative fromIndex (array-like)', function() {
      expect.assertions(2);
      expect(indexOf(testAL, 2, -5, 'SameValueZero')).toBe(6);
      expect(indexOf(testAL, 2, -11, 'SameValueZero')).toBe(0);
    });

    it('should work with fromIndex being greater than the length (array-like)', function() {
      expect.assertions(1);
      expect(indexOf(testAL, 0, 20, 'SameValueZero')).toBe(-1);
    });

    it('should work with fromIndex being negative and greater than the length (array-like)', function() {
      expect.assertions(1);
      expect(indexOf(testAL, 'hej', -20, 'SameValueZero')).toBe(4);
    });
  });
});

describe('indexOf: SameValue', function() {
  let testSubject;

  beforeEach(function() {
    testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, 2, false, 0, -0, NaN];
    delete testSubject[1];
  });

  it('should find the element', function() {
    expect.assertions(1);
    const expected = 4;
    const actual = indexOf(testSubject, 'hej', 'SameValue');
    expect(actual).toBe(expected);
  });

  it('should not find the element', function() {
    expect.assertions(1);
    const expected = -1;
    const actual = indexOf(testSubject, 'mus', 'SameValue');
    expect(actual).toBe(expected);
  });

  ifHasDenseUndefinedsIt('should find undefined as well', function() {
    expect.assertions(1);
    const expected = -1;
    const actual = indexOf(testSubject, undefined, 'SameValue');
    expect(actual).not.toBe(expected);
  });

  ifHasDenseUndefinedsIt('should skip unset indexes', function() {
    expect.assertions(1);
    const expected = 2;
    const actual = indexOf(testSubject, undefined, 'SameValue');
    expect(actual).toBe(expected);
  });

  it('should use a SameValue test', function() {
    expect.assertions(4);
    let actual = indexOf(testSubject, null, 'SameValue');
    expect(actual).toBe(5);

    actual = indexOf(testSubject, '2', 'SameValue');
    expect(actual).toBe(-1);

    actual = indexOf(testSubject, NaN, 'SameValue');
    expect(actual).toBe(10);

    actual = indexOf(testSubject, -0, 'SameValue');
    expect(actual).toBe(9);
  });

  it('should skip the first if fromIndex is set', function() {
    expect.assertions(3);
    expect(indexOf(testSubject, 2, 2, 'SameValue')).toBe(6);
    expect(indexOf(testSubject, 2, 0, 'SameValue')).toBe(0);
    expect(indexOf(testSubject, 2, 6, 'SameValue')).toBe(6);
  });

  it('should work with negative fromIndex', function() {
    expect.assertions(2);
    expect(indexOf(testSubject, 2, -5, 'SameValue')).toBe(6);
    expect(indexOf(testSubject, 2, -11, 'SameValue')).toBe(0);
  });

  it('should work with fromIndex being greater than the length', function() {
    expect.assertions(1);
    expect(indexOf(testSubject, 0, 20, 'SameValue')).toBe(-1);
  });

  it('should work with fromIndex being negative and greater than the length', function() {
    expect.assertions(1);
    expect(indexOf(testSubject, 'hej', -20, 'SameValue')).toBe(4);
  });

  it('should work with object items', function() {
    expect.assertions(6);
    const a = [];
    const b = {};
    const c = new Date();
    const arr = [a, b, c];
    expect(indexOf(arr, a, 'SameValue')).toBe(0);
    expect(indexOf(arr, b, 'SameValue')).toBe(1);
    expect(indexOf(arr, c, 'SameValue')).toBe(2);
    expect(indexOf(arr, [], 'SameValue')).toBe(-1);
    expect(indexOf(arr, {}, 'SameValue')).toBe(-1);
    expect(indexOf(arr, new Date(), 'SameValue')).toBe(-1);
  });

  describe('array-like', function ArrayLike() {
    let testAL;

    beforeEach(function beforeEach() {
      testAL = {};
      testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, 2, false, 0, -0, NaN];
      testSubject.forEach(function(o, i) {
        testAL[i] = o;
      });
      testAL.length = testSubject.length;
    });

    it('should find the element (array-like)', function() {
      expect.assertions(1);
      const expected = 4;
      const actual = indexOf(testAL, 'hej', 'SameValue');
      expect(actual).toBe(expected);
    });

    it('should not find the element (array-like)', function() {
      expect.assertions(1);
      const expected = -1;
      const actual = indexOf(testAL, 'mus', 'SameValue');
      expect(actual).toBe(expected);
    });

    ifHasDenseUndefinedsIt('should find undefined as well (array-like)', function() {
      expect.assertions(1);
      const expected = -1;
      const actual = indexOf(testAL, undefined, 'SameValue');
      expect(actual).not.toBe(expected);
    });

    ifHasDenseUndefinedsIt('should skip unset indexes (array-like)', function() {
      expect.assertions(1);
      const expected = 2;
      const actual = indexOf(testAL, undefined, 'SameValue');
      expect(actual).toBe(expected);
    });

    it('should use a SameValue test (array-like)', function() {
      expect.assertions(2);
      let actual = indexOf(testAL, null, 'SameValue');
      expect(actual).toBe(5);

      actual = indexOf(testAL, '2', 'SameValue');
      expect(actual).toBe(-1);
    });

    it('should skip the first if fromIndex is set (array-like)', function() {
      expect.assertions(3);
      expect(indexOf(testAL, 2, 2, 'SameValue')).toBe(6);
      expect(indexOf(testAL, 2, 0, 'SameValue')).toBe(0);
      expect(indexOf(testAL, 2, 6, 'SameValue')).toBe(6);
    });

    it('should work with negative fromIndex (array-like)', function() {
      expect.assertions(2);
      expect(indexOf(testAL, 2, -5, 'SameValue')).toBe(6);
      expect(indexOf(testAL, 2, -11, 'SameValue')).toBe(0);
    });

    it('should work with fromIndex being greater than the length (array-like)', function() {
      expect.assertions(1);
      expect(indexOf(testAL, 0, 20, 'SameValue')).toBe(-1);
    });

    it('should work with fromIndex being negative and greater than the length (array-like)', function() {
      expect.assertions(1);
      expect(indexOf(testAL, 'hej', -20, 'SameValue')).toBe(4);
    });
  });
});
