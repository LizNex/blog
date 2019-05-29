---
layout: post
title: "javascript设计模式与实践 第一章 面向对象的javascript"
subtitle: ""
date: 2019-04-15 12:00:00
author: "左手喝水"
header-img: "img/post-bg-2015.jpg"
tags:
  - 设计模式
---

> “站在巨人的肩上写代码”

## 前言

- 本文中设计模式的学习是通过《javascript 设计模式与实践》一书，所以也算是这本书的读书笔记，笔记格式采用康奈尔笔记格式；
- 相关设计模式实践仓库：<https://github.com/LizNex/design-Mode>

## 第一章 面向对象的 javascript

### 1.1 动态类型语言和鸭子类型

静态类型：

- 优点：编译器事先知道变量的类型是什么，可以提交校验代码。其次事先知道类型编译器还可以做代码优化。
- 缺点：增加更多的代码量，开发人员会把一部分精力放在声明类型上。不像动态类型完全关注业务逻辑就好。

动态类型：

- 优点：代码量少，代码越少越容易阅读，开发人员可以把更多的精力放在逻辑表达上。
- 缺点：无法保证变量类型，运行过程中可能会出相关的错误，这好像在商店买了一包牛肉辣条，但是要真正吃到嘴里才知道是不是牛肉味。

javascript 建立在鸭子模型的基础之上，鸭子模型就是

> 鸭子类型的通俗说法是:“如果它走起 路来像鸭子，叫起来也是鸭子，那么它就是鸭子。”

也就是不关心对象的类型，还是关注对象的行为。

```js
// 1.1 动态类型语言和鸭子类型
var duck = {
  duckSinging: function() {
    console.log("嘎嘎嘎");
  }
};
var chicken = {
  duckSinging: function() {
    console.log("嘎嘎嘎");
  }
};
var choir = []; // 合唱团
joinChoir = function(animal) {
  if (animal && typeof animal.duckSinging === "function") {
    choir.push(animal);
    console.log("恭喜加入合唱团");
    console.log("合唱团已有成员数量:" + choir.length);
  }
};
joinChoir(duck); // 恭喜加入合唱团 joinChoir( chicken ); // 恭喜加入合唱团
```

### 1.2 多态

多态背后的思想是将“做什么”和“谁去做以及怎样去做”分离开来  
也就是将“不变的事物”与 “可能改变的事物”分离开来。

```js
// 1.2 多态
var makeSound = function(animal) {
  animal.sound();
};
var Duck = function() {};
Duck.prototype.sound = function() {
  console.log("嘎嘎嘎");
};
var Chicken = function() {};
Chicken.prototype.sound = function() {
  console.log("咯咯咯");
};
makeSound(new Duck()); // 嘎嘎嘎
makeSound(new Chicken()); // 咯咯咯

Dog.prototype.sound = function() {
  console.log("汪汪汪");
};
makeSound(new Dog()); // 汪汪汪
```

在书中的鸭子叫例子中就是把每个动物都会叫，把“叫”这个行为（做什么）抽象了出来，每个小动物只要实现叫的方法就可以了。每次调用不变的“叫”方法，传入不同的小动物（谁去做），输出的内容根据动物的种类不同而不同，从而实现了多态。

实现多态的方式有很多：抽象，继承  
上面这个例子就是使用抽象来实现多态

js 与静态类型多态实现不同，js 在运行过程中可以转换类型，而在调用方法的时候也不同做类型检查，所以不用关心类型是什么，只需要对象实现相应的方法就可以了，也就是面向接口编程。

> 多态的最根本好处在于，你不必再向对象询问“你是什么类型”而后根据得到的答案调用对象的某个行为——你只管调用该行为就是了，其他的一切多态机制都会为你安排妥当。

换句话说，多态最根本的作用就是通过把过程化的条件分支语句转化为对象的多态性，从而消除这些条件分支语句。

### 1.3 封装

封装：封装的目的是将信息隐藏，隐藏数据、数据类型、内部实现、内部设计等等。只要对外的接口或者调用方式没有变化，用户就不用关心它内部实现的改变。

```js
// 封装
// js中使用方法来实现作用域
var myObject = (function() {
  var __name = "sven"; // 私有(private)变量
  return {
    getName: function() {} // 共有(public)变量
  };
})();
console.log(myObject.getName()); // 输出:sven
console.log(myObject.__name); // 输出:undefined
```

在 js 中声明私有变量大多是采用闭包的形式来完成，目前也提案将 `#` 作为新的私有属性标记（社区中已经很有很多反对声音）

### 1.4 原型模式和基于原型继承的 JavaScript 对象系统

js 是使用原型模式来完成继承

原型模式

![prototype](/blog/img/in-post/design-mode-charpter-1/prototype.png)

- 所有的数据都是对象。
- 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它。
- 对象会记住它的原型。
- 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型。

```js
// 使用原型克隆对象
var Plane = function() {
  this.blood = 100;
  this.attackLevel = 1;
  this.defenseLevel = 1;
};
var plane = new Plane();
plane.blood = 500;
plane.attackLevel = 10;
plane.defenseLevel = 7;
var clonePlane = Object.create(plane);
console.log(clonePlane); // 输出:Object {blood: 500, attackLevel: 10, defenseLevel: 7}

// 在不支持 Object.create 方法的浏览器中，则可以使用以下代码:
Object.create =
  Object.create ||
  function(obj) {
    var F = function() {};
    F.prototype = obj;
    return new F();
  };
```

js 中 new 一个对象的过程
例如要 new 一个 person 对象

1. 创建一个 object 对象
2. 新 object 对象的 \_\_proto\_\_ 指向 person 的原型
3. 对 object 对象使用构造函数（将构造函数的 this 指向 object 执行构造函数）
4. 判断构造函数后返回的值是不是 object 类型的，如果是返回构造函数返回的内容，如果不是返回 object 对象

代码实现

```js
  function new (constructor,...arg){
    let object = new Object();
    object.__proto__ =  constructor.prototype
    let result = constructor.call(object,arg)
    return  instanceOf "Object" ? result: object
  }
```

new 过程中原型链变化

![new 对象初始化](/blog/img/in-post/design-mode-charpter-1/new-step-0.png)

<center style="color:#999">new对象 初始化状态</center>

![new 对象第一步](/blog/img/in-post/design-mode-charpter-1/new-step-1.png)

<center style="color:#999">new对象 第1步</center>

![new 对象第二步](/blog/img/in-post/design-mode-charpter-1/new-step-2.png)

<center style="color:#999">new对象 第2步</center>

`object` 刚被 `new` 出来的时候本身是没有 `constructor` 属性的，但在浏览器运行 `object.constructor` 时得到 `Object`构造函数。  
这是因为当 `objec` 本身找不到属性的时候就会去找它的原型，`object.prototype.constructor` 指向 `Object`,所以 `object.constructor` 指向 `Object`。  
也就是说改变了`object.__proto__`的话，也同时改变了它构造函数的指向
