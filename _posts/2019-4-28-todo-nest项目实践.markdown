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

首先介绍一下 nest 的基础功能中遇到的一些问题吧，小标题都有链接可以跳转相应的 nest 中文文档，目前文档的版本是 6.x，小伙伴们注意版本哦。

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

### [提供者](https://docs.nestjs.cn/6/provider)

provider 在 nest 中是比较重要的角色，nest 中经常会说到的依赖注入很大部分就是在说这个 provider；  
provider 就要从 service 说起，service 是承担业务逻辑的部分，比如用户、商品的处理就可以写在不同 service 中处理；而用户购买商品的时候用户 service 就要引用商品 service ，例如

```ts
@Injectable()
export class UserService {
  constructor(private readonly goodsService: GoodsService) {}
}
```

在构造函数中直接注入 GoodsService 不用再去实例化 nest 会帮你把实例化的对象引入进来；
nest 会把每个 service 都生一个单例，不同模块注入的时候都是同一个实例对象，这是为了不生成多余的 service 浪费内存或导致实例之间的混乱。
注意要注入其他模块的 service 需要先在模块中注册包含引入 service 的模块；

### [模块](https://docs.nestjs.cn/6/modules)

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

第一个参数 exception 是捕捉到的异常实例，底层都是继承 node 的 error 类；一般包含报错信息、错误代码堆栈等等.  
第二个参数 host 类型是`ArgumentsHost`，文档里面是这样描述这个类型的

> 是传递给原始处理程序的参数的一个包装

什么意思呢？就是原本请求到后端然后报错了，如果是 http 请求的话，那么就包含`request reponses`这样的信息，`ArgumentsHost`就是基于这类信息的包装。websocke 请求的话包含的信息就是`client data`这种。这样不管什么类型的请求 nest 只用`ArgumentsHost`类来传递报错位置的原始信息就好了。

## 功能

接下来介绍一下基于 nest 基础实现的一些功能

### [入参校验](https://docs.nestjs.cn/6/techniques?id=%E9%AA%8C%E8%AF%81)

每个后端服务都应该有前端传入参数验证机制，nest 使用 pipe 来完成验证，自带了`ValidationPipe`来完成验证。

```ts
// mian.ts
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(new ValidationPipe()); // 在这里使用全局的验证pipe
  await app.listen(3000);
}
bootstrap();
```

`ValidationPipe`是从`@nestjs/common`中引入的，中间可能会提示需要安装[class-validator](https://github.com/typestack/class-validator), [class-transform](https://github.com/typestack/class-transformer)按照提示安装就好了，接下来设置类型具体校验的规则。

这里就采用官方的例子啦

```ts
// xxx.controller.ts
@Post()
create(@Body() createUserDto: CreateUserDto) { // 在控制器中加入传入参数的类型
  return 'This action adds a new user';
}
```

```ts
// 你的某个dto类
import { IsEmail, IsNotEmpty } from "class-validator"; // 校验包，没有要装一下

export class CreateUserDto {
  @IsEmail() // 校验是否email类型
  email: string;

  @IsNotEmpty() // 校验不为空
  password: string;
}
```

```js
// 请求错误返回报文
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    {
      "target": {},
      "property": "email",
      "children": [],
      "constraints": {
        "isEmail": "email must be an email"// email格式错误
      }
    }
  ]
}
```

好啦整个校验流程就是这样了，如果要校验其他类的话在他的属性上添加校验装饰器即可。
请求校验失败也会抛出错误，所以也会被 error filter 捕捉到，捕捉到以后就可以重新组织报错报文，统一格式传回给前端。

### [日志](https://docs.nestjs.cn/6/techniques?id=%E6%97%A5%E5%BF%97)

nest 自带的日志很弱。。控制台输出一下的那种。。虽然也可以自定义日志类接入，但是报错抛出异常的时候并不能正常输出 error 信息（也可能是我操作的姿势不对 orz。。。）所以我就改

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
