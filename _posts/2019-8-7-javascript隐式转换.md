---
layout: post
title: "javascript隐式转换"
subtitle: ""
date: 2018-09-27 12:00:00
author: "左手喝水"
header-img: "img/post-bg-2015.jpg"
tags:
  - js
---

## ToString、ToNumber、ToBoolean、ToPrimitive

### ToString

- null：转为"null"
- undefined：转为"undefined"
- 布尔类型：true 和 false 分别被转为"true"和"false"
- 数字类型：转为数字的字符串形式，如 10 转为"10"， 1e21 转为"1e+21"
- 数组：转为字符串是将所有元素按照","连接起来，相当于调用数组的 Array.prototype.join()方-法，如[1, 2, 3]转为"1,2,3"，空数组[]转为空字符串，数组中的 null 或 undefined，会被当做空字符串处理
- 普通对象：转为字符串相当于直接使用 Object.prototype.toString()，返回"[object Object]"

```js
String(null); // 'null'
String(undefined); // 'undefined'
String(true); // 'true'
String(10); // '10'
String(1e21); // '1e+21'
String([1, 2, 3]); // '1,2,3'
String([]); // ''
String([null]); // ''
String([1, undefined, 3]); // '1,,3'
String({}); // '[object Objecr]'
```

### ToNumber

- null： 转为 0
- undefined：转为 NaN
- 字符串：如果是纯数字形式，则转为对应的数字，空字符转为 0, 否则一律按转换失败处理，转为 NaN
- 布尔型：true 和 false 被转为 1 和 0
- 数组：数组首先会被转为原始类型，也就是 ToPrimitive，然后在根据转换后的原始类型按照上面的规则处理，关于 ToPrimitive，会在下文中讲到
- 对象：同数组的处理

```js
Number(null); // 0
Number(undefined); // NaN
Number("10"); // 10
Number("10a"); // NaN
Number(""); // 0
Number(true); // 1
Number(false); // 0
Number([]); // 0
Number(["1"]); // 1
Number({}); // NaN
```

### ToBoolean

js 中的假值只有 false、null、undefined、空字符、0 和 NaN，其它值转为布尔型都为 true。

```js
Boolean(null); // false
Boolean(undefined); // false
Boolean(""); // flase
Boolean(NaN); // flase
Boolean(0); // flase
Boolean([]); // true
Boolean({}); // true
Boolean(Infinity); // true
```

### ToPrmitive

`ToPrimitive(obj,preferredType)`函数接受两个参数，第一个是被转换的对象，第二个是希望转换成的类型（默认为空，接受的值为 Number 或 String）在执行 ToPrimitive(obj,preferredType)时如果第二个参数为空并且 obj 为 Date 的实例时,此时 preferredType 会被设置为 String，其他情况下 preferredType 都会被设置为 Number 如果 preferredType 为 Number，
ToPrimitive 执行过程如下：

1. 如果 obj 为原始值，直接返回；
2. 否则调用 obj.valueOf()，如果执行结果是原始值，返回之；
3. 否则调用 obj.toString()，如果执行结果是原始值，返回之；
4. 否则抛异常。

如果 preferredType 为 String，将上面的第 2 步和第 3 步调换，即：

1. 如果 obj 为原始值，直接返回；
2. 否则调用 obj.toString()，如果执行结果是原始值，返回之；
3. 否则调用 obj.valueOf()，如果执行结果是原始值，返回之；
4. 否则抛异常。

```js
Number([]); // 0
Number(["10"]); //10

const obj1 = {
  valueOf() {
    return 100;
  },
  toString() {
    return 101;
  }
};
Number(obj1); // 100

const obj2 = {
  toString() {
    return 102;
  }
};
Number(obj2); // 102

const obj3 = {
  toString() {
    return {};
  }
};
Number(obj3); // TypeError
```

## 宽松相等（==）比较时的隐式转换规则

### 布尔类型和其他类型

`布尔类型`比较时会转换为`数字类型`也就是`ToNumber`再比较

```js
false == 0; // true
true == 1; // true
true == 2; // false

true == "abc"; // false
true == []; // false
```

### 数字类型和字符串

这个两个类型比较时，`字符串类型`会转换成`数字类型`  
`布尔类型`也会转换成`数字类型`,所以`字符串类型`和`布尔类型比较`的时候也是`数字类型`和`字符串类型`的比较

```js
0 == ""; // true
1 == "1"; // true
1e21 == "1e21"; // true
Infinity == "Infinity"; // true
true == "1"; // true
false == "0"; // true
false == ""; // true
```

另外：`NaN`和任何值都不相等，包括他自己。

### 对象类型和原始类型

这个两个对象比较的时候，对象类型会`ToPrimitive`转换成原始类型

```js
"[object Object]" == {}; // true
"1,2,3" == [1, 2, 3]; // true
[2] == 2; // true
[null] == 0 // true
[undefined] == 0 // true
[] == 0 // true
```

这里注意数组`ToPrimitive`是数组使用 `toString` 方法而不是数组内部的元素

```js
const a = {
  // 定义一个属性来做累加
  i: 1,
  valueOf() {
    return this.i++;
  }
};
a == 1 && a == 2 && a == 3; // true
```

### null 和 undefined

`null`和 `undefined`宽松相等，和自身也宽松相等，但和其他值都不相等

```js
null == false; // false
undefined == false; // false
null == null; // true
undefined == undefined; // true
null == undefined; // true
```

### 示例

```js
  [] == ![]             // true

  [] == 0               // true

  [2] == 2              // true

  ['0'] == false        // true

  '0' == false          // true

  [] == false           // true

  [null] == 0           // true

  null == 0             // false

  [null] == false       // true

  null == false         // false

  [undefined] == false  // true

  undefined == false    // false

```

## 运算法的隐式转换规则

搞清了上面的`ToPrimitive`再来理解这个就方便多了，先直接给出相加逻辑：

1. 加号两边都`ToPrimitive`转换为原始值(`valueOf`->`toString` 除 `Date` 类型)
2. 如果两边中有任意一个值是字符串则返回两个值的字符串拼接，否则进入下一步
3. 将两个值 `ToNumber`后相加得到返回值

```js
a = {} + 1; //  1[object Object] 在chrome浏览器中{}在前面会被当成代码块变成+1的情况返回为1

1 + true; // 2

1 + false; //1

1+[] // 1

[]+{}//[object Object]
```

参考：

掘金-从一道面试题说起—js 隐式转换踩坑合集:
<https://juejin.im/post/5bc5c752f265da0a9a399a62>

知乎-JavaScript 中加号运算符的类型转换优先级是什么？: <https://www.zhihu.com/question/21484710>

```

```
