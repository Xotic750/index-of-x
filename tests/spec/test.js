'use strict';

// IE 6 - 8 have a bug where this returns false.
var canDistinguish = 0 in [undefined];
var ifHasDenseUndefinedsIt = canDistinguish ? it : xit;
var undefinedIfNoSparseBug = canDistinguish ? undefined : {
  valueOf: function () {
    return 0;
  }
};
var indexOf;

if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function (key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  indexOf = require('../../index.js');
} else {
  indexOf = returnExports;
}

describe('indexOf', function () {
  var testSubject;

  beforeEach(function () {
    testSubject = [
      2,
      3,
      undefinedIfNoSparseBug,
      true,
      'hej',
      null,
      2,
      false,
      0,
      -0,
      NaN
    ];
    delete testSubject[1];
  });

  it('should find the element', function () {
    var expected = 4;
    var actual = indexOf(testSubject, 'hej');
    expect(actual).toBe(expected);
  });

  it('should not find the element', function () {
    var expected = -1;
    var actual = indexOf(testSubject, 'mus');
    expect(actual).toBe(expected);
  });

  ifHasDenseUndefinedsIt('should find undefined as well', function () {
    var expected = -1;
    var actual = indexOf(testSubject, undefined);
    expect(actual).not.toBe(expected);
  });

  ifHasDenseUndefinedsIt('should skip unset indexes', function () {
    var expected = 2;
    var actual = indexOf(testSubject, undefined);
    expect(actual).toBe(expected);
  });

  it('should use a strict test', function () {
    var actual = indexOf(testSubject, null);
    expect(actual).toBe(5);

    actual = indexOf(testSubject, '2');
    expect(actual).toBe(-1);

    actual = indexOf(testSubject, NaN);
    expect(actual).toBe(-1);

    actual = indexOf(testSubject, -0);
    expect(actual).toBe(8);
  });

  it('should skip the first if fromIndex is set', function () {
    expect(indexOf(testSubject, 2, 2)).toBe(6);
    expect(indexOf(testSubject, 2, 0)).toBe(0);
    expect(indexOf(testSubject, 2, 6)).toBe(6);
  });

  it('should work with negative fromIndex', function () {
    expect(indexOf(testSubject, 2, -5)).toBe(6);
    expect(indexOf(testSubject, 2, -11)).toBe(0);
    expect(indexOf(testSubject, 2, -Infinity)).toBe(0);
  });

  it('should work with fromIndex being greater than the length', function () {
    expect(indexOf(testSubject, 0, 20)).toBe(-1);
    expect(indexOf(testSubject, 0, Infinity)).toBe(-1);
  });

  it('should work with fromIndex being negative and greater than the length', function () {
    expect(indexOf(testSubject, 'hej', -20)).toBe(4);
  });

  it('should work with object items', function () {
    var a = [];
    var b = {};
    var c = new Date();
    var arr = [
      a,
      b,
      c
    ];
    expect(indexOf(arr, a)).toBe(0);
    expect(indexOf(arr, b)).toBe(1);
    expect(indexOf(arr, c)).toBe(2);
    expect(indexOf(arr, [])).toBe(-1);
    expect(indexOf(arr, {})).toBe(-1);
    expect(indexOf(arr, new Date())).toBe(-1);
  });

  describe('Array-like', function ArrayLike() {
    var testAL;

    beforeEach(function beforeEach() {
      testAL = {};
      testSubject = [
        2,
        3,
        undefinedIfNoSparseBug,
        true,
        'hej',
        null,
        2,
        false,
        0,
        -0,
        NaN
      ];
      testSubject.forEach(function (o, i) {
        testAL[i] = o;
      });
      testAL.length = testSubject.length;
    });

    it('should find the element (array-like)', function () {
      var expected = 4;
      var actual = indexOf(testAL, 'hej');
      expect(actual).toBe(expected);
    });

    it('should not find the element (array-like)', function () {
      var expected = -1;
      var actual = indexOf(testAL, 'mus');
      expect(actual).toBe(expected);
    });

    ifHasDenseUndefinedsIt('should find undefined as well (array-like)', function () {
      var expected = -1;
      var actual = indexOf(testAL, undefined);
      expect(actual).not.toBe(expected);
    });

    ifHasDenseUndefinedsIt('should skip unset indexes (array-like)', function () {
      var expected = 2;
      var actual = indexOf(testAL, undefined);
      expect(actual).toBe(expected);
    });

    it('should use a strict test (array-like)', function () {
      var actual = indexOf(testAL, null);
      expect(actual).toBe(5);

      actual = indexOf(testAL, '2');
      expect(actual).toBe(-1);
    });

    it('should skip the first if fromIndex is set (array-like)', function () {
      expect(indexOf(testAL, 2, 2)).toBe(6);
      expect(indexOf(testAL, 2, 0)).toBe(0);
      expect(indexOf(testAL, 2, 6)).toBe(6);
    });

    it('should work with negative fromIndex (array-like)', function () {
      expect(indexOf(testAL, 2, -5)).toBe(6);
      expect(indexOf(testAL, 2, -11)).toBe(0);
    });

    it('should work with fromIndex being greater than the length (array-like)', function () {
      expect(indexOf(testAL, 0, 20)).toBe(-1);
    });

    it('should work with fromIndex being negative and greater than the length (array-like)', function () {
      expect(indexOf(testAL, 'hej', -20)).toBe(4);
    });
  });
});

describe('indexOf: SameValueZero', function () {
  var testSubject;

  beforeEach(function () {
    testSubject = [
      2,
      3,
      undefinedIfNoSparseBug,
      true,
      'hej',
      null,
      2,
      false,
      0,
      -0,
      NaN
    ];
    delete testSubject[1];
  });

  it('should find the element', function () {
    var expected = 4;
    var actual = indexOf(testSubject, 'hej', 'SameValueZero');
    expect(actual).toBe(expected);
  });

  it('should not find the element', function () {
    var expected = -1;
    var actual = indexOf(testSubject, 'mus', 'SameValueZero');
    expect(actual).toBe(expected);
  });

  ifHasDenseUndefinedsIt('should find undefined as well', function () {
    var expected = -1;
    var actual = indexOf(testSubject, undefined, 'SameValueZero');
    expect(actual).not.toBe(expected);
  });

  ifHasDenseUndefinedsIt('should skip unset indexes', function () {
    var expected = 2;
    var actual = indexOf(testSubject, undefined, 'SameValueZero');
    expect(actual).toBe(expected);
  });

  it('should use a SameValueZero test', function () {
    var actual = indexOf(testSubject, null, 'SameValueZero');
    expect(actual).toBe(5);

    actual = indexOf(testSubject, '2', 'SameValueZero');
    expect(actual).toBe(-1);

    actual = indexOf(testSubject, NaN, 'SameValueZero');
    expect(actual).toBe(10);

    actual = indexOf(testSubject, -0, 'SameValueZero');
    expect(actual).toBe(8);
  });

  it('should skip the first if fromIndex is set', function () {
    expect(indexOf(testSubject, 2, 2, 'SameValueZero')).toBe(6);
    expect(indexOf(testSubject, 2, 0, 'SameValueZero')).toBe(0);
    expect(indexOf(testSubject, 2, 6, 'SameValueZero')).toBe(6);
  });

  it('should work with negative fromIndex', function () {
    expect(indexOf(testSubject, 2, -5, 'SameValueZero')).toBe(6);
    expect(indexOf(testSubject, 2, -11, 'SameValueZero')).toBe(0);
  });

  it('should work with fromIndex being greater than the length', function () {
    expect(indexOf(testSubject, 0, 20, 'SameValueZero')).toBe(-1);
  });

  it('should work with fromIndex being negative and greater than the length', function () {
    expect(indexOf(testSubject, 'hej', -20, 'SameValueZero')).toBe(4);
  });

  it('should work with object items', function () {
    var a = [];
    var b = {};
    var c = new Date();
    var arr = [
      a,
      b,
      c
    ];
    expect(indexOf(arr, a, 'SameValueZero')).toBe(0);
    expect(indexOf(arr, b, 'SameValueZero')).toBe(1);
    expect(indexOf(arr, c, 'SameValueZero')).toBe(2);
    expect(indexOf(arr, [], 'SameValueZero')).toBe(-1);
    expect(indexOf(arr, {}, 'SameValueZero')).toBe(-1);
    expect(indexOf(arr, new Date(), 'SameValueZero')).toBe(-1);
  });

  describe('Array-like', function ArrayLike() {
    var testAL;

    beforeEach(function beforeEach() {
      testAL = {};
      testSubject = [
        2,
        3,
        undefinedIfNoSparseBug,
        true,
        'hej',
        null,
        2,
        false,
        0,
        -0,
        NaN
      ];
      testSubject.forEach(function (o, i) {
        testAL[i] = o;
      });
      testAL.length = testSubject.length;
    });

    it('should find the element (array-like)', function () {
      var expected = 4;
      var actual = indexOf(testAL, 'hej', 'SameValueZero');
      expect(actual).toBe(expected);
    });

    it('should not find the element (array-like)', function () {
      var expected = -1;
      var actual = indexOf(testAL, 'mus', 'SameValueZero');
      expect(actual).toBe(expected);
    });

    ifHasDenseUndefinedsIt('should find undefined as well (array-like)', function () {
      var expected = -1;
      var actual = indexOf(testAL, undefined, 'SameValueZero');
      expect(actual).not.toBe(expected);
    });

    ifHasDenseUndefinedsIt('should skip unset indexes (array-like)', function () {
      var expected = 2;
      var actual = indexOf(testAL, undefined, 'SameValueZero');
      expect(actual).toBe(expected);
    });

    it('should use a SameValueZero test (array-like)', function () {
      var actual = indexOf(testAL, null, 'SameValueZero');
      expect(actual).toBe(5);

      actual = indexOf(testAL, '2', 'SameValueZero');
      expect(actual).toBe(-1);
    });

    it('should skip the first if fromIndex is set (array-like)', function () {
      expect(indexOf(testAL, 2, 2, 'SameValueZero')).toBe(6);
      expect(indexOf(testAL, 2, 0, 'SameValueZero')).toBe(0);
      expect(indexOf(testAL, 2, 6, 'SameValueZero')).toBe(6);
    });

    it('should work with negative fromIndex (array-like)', function () {
      expect(indexOf(testAL, 2, -5, 'SameValueZero')).toBe(6);
      expect(indexOf(testAL, 2, -11, 'SameValueZero')).toBe(0);
    });

    it('should work with fromIndex being greater than the length (array-like)', function () {
      expect(indexOf(testAL, 0, 20, 'SameValueZero')).toBe(-1);
    });

    it('should work with fromIndex being negative and greater than the length (array-like)', function () {
      expect(indexOf(testAL, 'hej', -20, 'SameValueZero')).toBe(4);
    });
  });
});

describe('indexOf: SameValue', function () {
  var testSubject;

  beforeEach(function () {
    testSubject = [
      2,
      3,
      undefinedIfNoSparseBug,
      true,
      'hej',
      null,
      2,
      false,
      0,
      -0,
      NaN
    ];
    delete testSubject[1];
  });

  it('should find the element', function () {
    var expected = 4;
    var actual = indexOf(testSubject, 'hej', 'SameValue');
    expect(actual).toBe(expected);
  });

  it('should not find the element', function () {
    var expected = -1;
    var actual = indexOf(testSubject, 'mus', 'SameValue');
    expect(actual).toBe(expected);
  });

  ifHasDenseUndefinedsIt('should find undefined as well', function () {
    var expected = -1;
    var actual = indexOf(testSubject, undefined, 'SameValue');
    expect(actual).not.toBe(expected);
  });

  ifHasDenseUndefinedsIt('should skip unset indexes', function () {
    var expected = 2;
    var actual = indexOf(testSubject, undefined, 'SameValue');
    expect(actual).toBe(expected);
  });

  it('should use a SameValue test', function () {
    var actual = indexOf(testSubject, null, 'SameValue');
    expect(actual).toBe(5);

    actual = indexOf(testSubject, '2', 'SameValue');
    expect(actual).toBe(-1);

    actual = indexOf(testSubject, NaN, 'SameValue');
    expect(actual).toBe(10);

    actual = indexOf(testSubject, -0, 'SameValue');
    expect(actual).toBe(9);
  });

  it('should skip the first if fromIndex is set', function () {
    expect(indexOf(testSubject, 2, 2, 'SameValue')).toBe(6);
    expect(indexOf(testSubject, 2, 0, 'SameValue')).toBe(0);
    expect(indexOf(testSubject, 2, 6, 'SameValue')).toBe(6);
  });

  it('should work with negative fromIndex', function () {
    expect(indexOf(testSubject, 2, -5, 'SameValue')).toBe(6);
    expect(indexOf(testSubject, 2, -11, 'SameValue')).toBe(0);
  });

  it('should work with fromIndex being greater than the length', function () {
    expect(indexOf(testSubject, 0, 20, 'SameValue')).toBe(-1);
  });

  it('should work with fromIndex being negative and greater than the length', function () {
    expect(indexOf(testSubject, 'hej', -20, 'SameValue')).toBe(4);
  });

  it('should work with object items', function () {
    var a = [];
    var b = {};
    var c = new Date();
    var arr = [
      a,
      b,
      c
    ];
    expect(indexOf(arr, a, 'SameValue')).toBe(0);
    expect(indexOf(arr, b, 'SameValue')).toBe(1);
    expect(indexOf(arr, c, 'SameValue')).toBe(2);
    expect(indexOf(arr, [], 'SameValue')).toBe(-1);
    expect(indexOf(arr, {}, 'SameValue')).toBe(-1);
    expect(indexOf(arr, new Date(), 'SameValue')).toBe(-1);
  });

  describe('Array-like', function ArrayLike() {
    var testAL;

    beforeEach(function beforeEach() {
      testAL = {};
      testSubject = [
        2,
        3,
        undefinedIfNoSparseBug,
        true,
        'hej',
        null,
        2,
        false,
        0,
        -0,
        NaN
      ];
      testSubject.forEach(function (o, i) {
        testAL[i] = o;
      });
      testAL.length = testSubject.length;
    });

    it('should find the element (array-like)', function () {
      var expected = 4;
      var actual = indexOf(testAL, 'hej', 'SameValue');
      expect(actual).toBe(expected);
    });

    it('should not find the element (array-like)', function () {
      var expected = -1;
      var actual = indexOf(testAL, 'mus', 'SameValue');
      expect(actual).toBe(expected);
    });

    ifHasDenseUndefinedsIt('should find undefined as well (array-like)', function () {
      var expected = -1;
      var actual = indexOf(testAL, undefined, 'SameValue');
      expect(actual).not.toBe(expected);
    });

    ifHasDenseUndefinedsIt('should skip unset indexes (array-like)', function () {
      var expected = 2;
      var actual = indexOf(testAL, undefined, 'SameValue');
      expect(actual).toBe(expected);
    });

    it('should use a SameValue test (array-like)', function () {
      var actual = indexOf(testAL, null, 'SameValue');
      expect(actual).toBe(5);

      actual = indexOf(testAL, '2', 'SameValue');
      expect(actual).toBe(-1);
    });

    it('should skip the first if fromIndex is set (array-like)', function () {
      expect(indexOf(testAL, 2, 2, 'SameValue')).toBe(6);
      expect(indexOf(testAL, 2, 0, 'SameValue')).toBe(0);
      expect(indexOf(testAL, 2, 6, 'SameValue')).toBe(6);
    });

    it('should work with negative fromIndex (array-like)', function () {
      expect(indexOf(testAL, 2, -5, 'SameValue')).toBe(6);
      expect(indexOf(testAL, 2, -11, 'SameValue')).toBe(0);
    });

    it('should work with fromIndex being greater than the length (array-like)', function () {
      expect(indexOf(testAL, 0, 20, 'SameValue')).toBe(-1);
    });

    it('should work with fromIndex being negative and greater than the length (array-like)', function () {
      expect(indexOf(testAL, 'hej', -20, 'SameValue')).toBe(4);
    });
  });
});
