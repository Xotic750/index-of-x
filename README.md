<a name="module_index-of-x"></a>
## index-of-x
<a href="https://travis-ci.org/Xotic750/index-of-x"
title="Travis status">
<img src="https://travis-ci.org/Xotic750/index-of-x.svg?branch=master"
alt="Travis status" height="18">
</a>
<a href="https://david-dm.org/Xotic750/index-of-x"
title="Dependency status">
<img src="https://david-dm.org/Xotic750/index-of-x.svg"
alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/index-of-x#info=devDependencies"
title="devDependency status">
<img src="https://david-dm.org/Xotic750/index-of-x/dev-status.svg"
alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/index-of-x" title="npm version">
<img src="https://badge.fury.io/js/index-of-x.svg"
alt="npm version" height="18">
</a>

An extended ES6 indexOf module.

**Version**: 1.0.0  
**Author:** Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_index-of-x--module.exports"></a>
### `module.exports(array, searchElement, [fromIndex], [extend])` ⇒ <code>number</code> ⏏
This method returns the first index at which a given element can be found
in the array, or -1 if it is not present.

**Kind**: Exported function  
**Returns**: <code>number</code> - Returns index of found element, otherwise -1.  
**Throws**:

- <code>TypeError</code> If `array` is `null` or `undefined`.


| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to search. |
| searchElement | <code>\*</code> | Element to locate in the `array`. |
| [fromIndex] | <code>number</code> | The index to start the search at. If the  index is greater than or equal to the array's length, -1 is returned,  which means the array will not be searched. If the provided index value is  a negative number, it is taken as the offset from the end of the array.  Note: if the provided index is negative, the array is still searched from  front to back. If the calculated index is less than 0, then the whole  array will be searched. Default: 0 (entire array is searched). |
| [extend] | <code>string</code> | Extension type: `SameValue` or `SameValueZero`. |

**Example**  
```js
var indexOf = require('index-of-x');
```
