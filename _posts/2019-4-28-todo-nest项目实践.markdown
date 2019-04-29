---
layout: post
title: "nest 项目实践"
subtitle: ""
date: 2019-04-15 12:00:00
author: "左手喝水"
header-img: "img/post-bg-2015.jpg"
tags:
  - node
---

> java 如日中天，node 穷追猛赶

## 简介

[nestjs6.x 中文文档](https://docs.nestjs.cn/6/introduction)  
[nestjs6.x 英文文档](https://docs.nestjs.com)(建议看英文文档，中文文档有些还没翻译完 2019-4-15)  
nestjs 是一款基于 node 的服务端框架，基于 Express 之上开发，所以 Express 可以使用的中间件组件 nestjs 都可以使用；  
写法类似 java spring boot，所以写 java 的后端同学上手也难易度也不是很高。  
nestjs 的依赖注入借鉴 angular 的思想，写法也十分相似前端写 angular 的同学也很容易上手。（学一个会两个 XD）  
使用 nestjs 除了熟悉框架提供的一些规则还要熟悉一下技能：node、数据库、服务端开发；对前端同学来说是一个好机会来了解后端开发吧。  
由于 nest 在中国普及率不是很高可以参考的资料有限，开发的过程中刚好遇到了 6.x 版本发布，写个文记录一下踩坑日志吧

## nest 基础

### [安装](https://docs.nestjs.cn/6/firststeps?id=%E7%AC%AC%E4%B8%80%E6%AD%A5)

开发环境：node、npm

安装使用：

```js
// 全局安装nestjs 脚手架
$ npm i -g @nestjs/cli
// 生成nestjs项目摸板 project-name是想要的项目名
$ nest new project-name
```

nestjs 脚手架提供了非常方便的内容例如：

```js
// 自动生成nest的service文件，service-name也可以写目录路径在指定的位置生成
nest g service service-name
```

除了自动生成 service 文件，还可以生成 module、controller、class 等等的文件，相关命令可以通过`nest -h`查看

### [控制器](https://docs.nestjs.cn/6/controllers)

控制器没有太多的雷区，就文档中没有说到`@Res @Req @Next`等等装饰器具体怎么用了；  
其实用法 Express 终端`res req next`是一样的，参考 Express 文档就好了。。。可能忽略我等小白的见识短浅所以没有写吧 :(

### 提供者

provider 在 nest 中是比较重要的角色，nest 中经常会说到的依赖注入很大部分就是在说这个 provider；  
provider 就要从 service 说起，service 是承担业务逻辑的部分，比如用户、商品的处理就可以写在不同 service 中处理；而用户购买商品的时候用户 service 就要引用商品 service ，例如

```ts
@Injectable()
export class UserService {
  constructor(private readonly goodsService: GoodsService) {}
}
```

在构造函数中直接注入 GoodsService 不用再去实例化 nest 会帮你把实例化的对象引入进来；
nest会把每个service都生一个单例，不同模块注入的时候都是同一个实例对象，这是为了不生成多余的service浪费内存或导致实例之间的混乱。
注意要注入其他模块的service需要先在模块中注册包含引入service的模块；

### 模块

模块基础使用部分参考：[nestjs6.x 文档-模块](https://docs.nestjs.cn/6/modules)

nest 采用依赖注入的思想来完成模块之间的引用，只有在模块中引用或者全局的模块才可以在其他模块中使用

需要注意的是

1. 模块循环引用  
   [正向引用](https://docs.nestjs.cn/6/fundamentals?id=%E6%AD%A3%E5%90%91%E5%BC%95%E7%94%A8)
   需要在 model 和 service 中都加上`forwardRef`标记
2. 全局模块使用导出  
   在需要全局使用的模块上加上 `@Gobal` 修饰符，注意全局模块和普通模块一样要导出使用的 `Service` 也就是 `exprots` 中填写导出的`Service`

### [error filter](https://docs.nestjs.cn/6/exceptionfilters)

error filter 可以捕捉所有抛出的异常；根据这个特性可以做通用的异常处理；

```ts
export class ErrorFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {

}
```
第一个参数 exception是捕捉到的异常实例，底层都是继承node的error类；一般包含报错信息、错误代码堆栈等等



## 功能

### 入参校验

### 日志

### typeorm

### api 文档

### 统一返回

### 定时任务

### 报错处理

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from "@nestjs/common";
import { BusinessException } from "../../util/businessException";
@Catch()
export class ErrorFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 捕捉业务错误
    if (exception instanceof BusinessException) {
      // do some thing...
      return;
    }

    // 捕捉内部错误
    if (!(exception instanceof HttpException)) {
      // do some thing...
      return;
    }

    // 捕捉剩下的前端请求错误
    const status = exception.getStatus();
    // do some thing ...
  }
}
```

`BusinessException` 是我自定义的业务错误类，只要业务上报错了都抛出这个异常  
内部错误一般用来记录错误信息的动作  
最后捕捉剩下的前端请求错误，做统一处理格式化处理

### cors 跨域

### 数据库

### 请求

### 配置文件

### 环境判断

## 提炼

### 模型转换

### 功能解耦
