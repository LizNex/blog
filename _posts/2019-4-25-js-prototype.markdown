---
layout: post
title: "js 原型链"
subtitle: ""
date: 2019-04-15 12:00:00
author: "左手喝水"
header-img: "img/post-bg-2015.jpg"
tags:
  - js
---

## 原型链

![prototype](/blog/img/in-post/prototype/status-init.png){:height="70%" width="70%"}

<center style="color:#999"> 原型链基础 </center>

原型链有三个关键属性：`constructor` `prototype` `__proto__`

举个例子来讲解这三个属性吧。

首先我们有个方法叫做 `Animal`,想要得到 `Animal`的实例需要以下步骤

- 声明一个`Animal`函数
- 通过`Animal`函数 `new` 一个实例得到实例

那么我们分步骤来理解这个过程中原型链的变化

> 声明一个`Animal`函数

代码与原型链如下：

```js
function Animal() {}
```

![声明方法时的原型链状态](/blog/img/in-post/prototype/status-function.png){:height="70%" width="70%"}

<center style="color:#999"> 声明一个Animal函数 </center>

`Animal`就是所谓的构造函数，而每个方法声明了以后会有一个对应的原型对象也就是`Animal.prototype`
`Animal.prototype.constructor` 指回构造函数。

> 通过`Animal`函数 `new` 一个实例得到实例

此时的代码原型链如下

```js
function Animal() {}
let animal = new Animal();
```

![new完以后原型链的状态](/blog/img/in-post/prototype/status-new.png){:height="70%" width="70%"}

<center style="color:#999"> new完以后原型链的状态 </center>

`__prototype`就是实例指向原型的属性。
new 只是一个方法把实例的`__proto__`指向`prototype`所以构造函数和实例之间并没有直接关系，不过可以通过`prototype`上的`constructor`找到构造函数。  
**那 new 方法做了什么呢？**

## new 一个实例的时候发生了什么

实际上`new`一个对象时候发生了以下事件：

1. 生成一个空的对象
2. 将空对象的`__proto__`指向原型`prototype`
3. 将构造函数`this`指向对象执行构造函数
4. 判断返回的参数，如果是一个对象则返回对象，如果不是返回经过处理的‘空对象’

还是按照步骤说明

> 生成一个空对象

![生成一个空对象](/blog/img/in-post/prototype/status-new-step-1.png){:height="70%" width="70%"}

<center style="color:#999"> 生成一个空对象 </center>

卧槽怎么一上来就那么复杂，是不是那么想？其实这里把对象底层依赖也画了出来。  
js 的所有对象都是基于 `Object`对象，所以`Animal.prototype.__protot__`指向的是`Object.prototype`  
生成的新对象也是`Object`的实例所以`__proto__`也指向`Object.prototype`

> 将空对象的`__proto__`指向原型`prototype`

![将空对象的`__proto__`指向原型`prototype`](/blog/img/in-post/prototype/status-new-step-2.png){:height="70%" width="70%"}

<center style="color:#999"> 将空对象的__proto__指向原型prototype </center>

改变了`Object.instance.__proto__`的指向，现在原型链的变化已经基本完成了，最后再让构造函数加工以下`Object.instance`就好了啦，加工过程不涉及原型链变动所以就将到这啦。

## 继承

原型链另一个非常有用的功能：继承  
我们来看下继承是原型链的变化吧

老样子我们有个`Animal`类, 然后有个`Dog`类继承 `Animal`,继承的步骤如下

```js
// 声明一个Animal类
function Animal(){}
// 获得Animal实例
const animal = new Animal()
// 声明一个Dog类
function Dog(){}
// Dog的prototype 指向animal实例
Dog.prototype = animal
// animal实例构造函数指向Dog
animal.constructor = Dog

// 得到一个继承于Animal的Dog 实例
const dog = new Dog()
```

完成以后的原型链是这样的
![继承](/blog/img/in-post/prototype/status-extend.png){:height="70%" width="70%"}

<center style="color:#999"> 继承 </center>

`Dog.prototype = animal`这都应该能够理解是为了替换原型  
`animal.constructor = Dog` 实例的构造函数指向`Dog` 为了正确关联`animal`和`Dog`的关系。
