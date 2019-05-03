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
3.动态模块
// TODO: 动态模块

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

nest 有2种方法实现日志（具体请参考日志文档）：
1. 实现loggerService接口，实现日志功能
2. 继承logger，扩展日志功能。

两种方法都可以完成日志功能的记录，搭配第三方工具可以有更好的效果，我搭配了winston，选择winston主要考虑到想要把日志记录的文件中、每天都要新建一个文件来记录日志、日记需要区分等级、定期清理过期日志等等。另外winston上github start数也比较高群众基础好。

// TODO:winston 可读性

### [typeorm](https://docs.nestjs.cn/6/techniques?id=%E6%95%B0%E6%8D%AE%E5%BA%93%EF%BC%88typeorm%EF%BC%89)

使用typeorm
1. 在根目录导入`TypeOrmModule`，设置连接数据库属性。
2. 建立实体类，加上对应的`Typeorm`装饰器。
3. 在需要的模块中引入注册实体类
    ```ts
    import { TypeOrmModule } from '@nestjs/typeorm';

    @Module({
      imports: [TypeOrmModule.forFeature([Photo])]
    })
    ```
4. 在service中引入对应仓库使用

    ```ts
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { Photo } from './photo.entity';

    @Injectable()
    export class PhotoService {
      constructor(
        @InjectRepository(Photo)
        private readonly photoRepository: Repository<Photo>,
      ) {}

      async findAll(): Promise<Photo[]> {
        return await this.photoRepository.find();
      }
    }

    ```
注意：
  1. 一对多/多对多关系
  2. 重命名数据库字段
  3. 更多方法参考typeorm文档

// TODO: forRoot的写法  
// TODO: factory的写法


### [api 文档 (swagger)](https://docs.nestjs.cn/6/recipes?id=openapi-swagger)

文档相关装饰器都从`@nestjs/swagger`中引入

控制器
```ts
import { ApiResponse, ApiImplicitParam, ApiOperation } from '@nestjs/swagger';

@Controller('dashboard')
export class DashboardController {
  @Get(':id')
  @ApiOperation({ title: '详情页接口' }) // 接口名
  @ApiResponse({
    status: 200,            // 接口状态
    type: ProjectDetailVo,  // 返回格式
    description: '',        // 描述
  })
  @ApiImplicitParam({
    name: '项目ID',          // 请求参数说明,这里就是传入id的说明
  })
  async projectDetail(@Param('id') id): Promise<IResponse> {
   // anything ... 
  }
}
```
类

```ts
import { ApiModelProperty } from '@nestjs/swagger';

export class BugDto {
  @ApiModelProperty({
    description: '总数',
  })
  total: number;
  @ApiModelProperty({
    description: 'bug解决率',
  })
  percentage: number;
  @ApiModelProperty({
    description: 'bug解决个数',
  })
}
```

nest的swagger界面有些落后，看起来还是有些吃力。  
我们为了多人协作也为了容易理解用了可以导入swagger生成json文件的[yapi](http://yapi.demo.qunar.com/)，配置yapi的更新接口每次启动项目都会更新yapi平台内的文档。

### 统一返回

为了能让输出的内容对前端比较友好，统一了返回格式，包括业务报错、内部程序报错、正常返回都用了统一格式进行返回。

统一返回格式
```ts
export interface IResponse {
  data?: any;           // 返回的内容信息
  message: string;      // 返回的提示message
  timestamp: number;    // 时间戳
  code: string;         // 返回code 判断返回类型
}
```


返回的message和code做了枚举对应

```ts
// 规定了枚举的格式的接口
import { ResultEnum } from '../../common/interface/result.enum.interface'; 

// 默认返回成功消息
export const SUCCESS: ResultEnum = {
  code: '10000',
  message: 'success',
};

// 默认返回失败消息
export const FAIL: ResultEnum = {
  code: '10001',
  message: 'fail',
};
```

统一的返回格式和对应的message code都有了现在就缺统一的方法把这些信息整合到一起了

```ts
import { IResponse } from '../common/interface/response.interface';
import { SUCCESS } from './constants/result.enum';
import { ResultEnum } from '../common/interface/result.enum.interface';

export class Result {
  // 静态方法任何地方都可以使用
  // 需要传递两个值 
  // data：返回给前端的信息
  // resultEnum：选填，事先规定的返回枚举，默认是返回成功的枚举
  public static create(
    data: any = null,
    resultEnum: ResultEnum = SUCCESS,  
  ): IResponse { // 规定返回格式是之前设定的格式
    const { code, message } = resultEnum;
    return {
      data,
      message,
      code,
      timestamp: new Date().getTime(),
    };
  }
}

```

好啦，现在只要在返回的时候调用这个方法，返回的数据格式和枚举信息都是我们规定的信息了。  
这样做的好处在于前端能够得到固定的格式信息、错误码的制定可以统一管理、返回格式时候不用每次关注格式是怎么样的，只要把返回值往返回的方法里传就可以了。


### 定时任务

定时任务使用的第三方插件[node-schedule](https://github.com/node-schedule/node-schedule#readme) 使用方法比较简单看文档就好。

### 报错处理

所有报错的处理集中在error filter中。  
这里任务报错分为三种
1. 业务报错  
  比如业务中没有权限访问的用户请求访问那么就会业务报错。
  业务报错专门制定了一个`BusinessException`来捕捉业务错误。

 ```ts
export class BusinessException extends Error {
  public code: string;

  constructor(someException) {
    super();
    // anything。。。
  }
}
 ```

 继承于Error类，业务上错误`throw` 这个错误类型 error filter就可以捕捉到了。好处在与可以统一处理业务报错返回格式或者添加其他逻辑易于管理。

2. 程序内部报错
   捕捉程序内部报错的问题，给前端友好的提示。

3. 前端请求报错
   捕捉前端参数错误或请求错误方式、权限等前端相关的前端报错，告诉前端错误原因。

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

### [cors 跨域](https://docs.nestjs.cn/6/techniques?id=cors)

很简单，在 `mian.ts` 中加上一句`app.enableCors();`就可以了。

### 请求
业务中有些数据是请求其他服务的，所以有了请求模块


```ts
import { Injectable, HttpService, forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class RequestService {
  private baseUrl: string;
  private cookie: string;
  private headers: any;

  constructor(
    private readonly httpService: HttpService,
  ) {
    this.cookie = '';
    this.baseUrl = '';
    this.headers = {
      'Content-type': 'application/json',
    };
  }

  // 通用request
  public async request(method, url: string, data?: any, headers?: object) {
    let res;
    
    url = url.replace(this.baseUrl, '');

    const requestConfig = {
      url: this.baseUrl + url,
      method,
      headers: {
        Cookie: this.cookie,
        ...this.headers,
        ...headers,
      },
      data,
    };
    res = await this.httpService
      .request(requestConfig)
      .toPromise()
      .catch(async err => {
        // 捕捉请求错误
        // anything...
      });
    return res.data
  }

  // 通用Post
  public async post(url: string, data?: any, headers?: object) {
    return await this.request('Post', url, data, headers);
  }
  // 通用Get
  public async get(url: string, data?: any, headers?: object) {
    return await this.request('Get', url, data, headers);
  }

  // 获得cookie
  public getCookie(): string {
    return this.cookie;
  }
  // 设置cookie
  public setCookie(cookie): void {
    this.cookie = cookie;
  }
}

```

### 配置文件

在src的同级目录下写了`nest.config.ts` 的文件来写入配置。官方也有把配置文件写成一个module的，这里是图方便就写了单个文件。官方的写法略麻烦但好处却不是很能够理解，还要多参悟参悟把。

### 环境判断

使用了[cross-env](https://github.com/kentcdodds/cross-env#readme) 这个插件，也就前端经常会用来判断环境但插件。

## 提炼

### 模型转换
模型转换一般是  DO->DTO->VO  
这三个东西分别是什么呢？  
DO就是实体类，数据库一张表有那些属性，这个DO类就有哪些属性，是用来和数据库交互但类。   
DTO是在类型的传输过程中，DO并不总是满足业务需求，有时需要一些额外的属性，这时候就需要一个可以传输的类在程序中传递，这就是DTO。DTO一般都是基于业务场景，将解耦后DO重新何在一起进行传输。
VO是前端对象类，这个类的作用就是把前端需要的数据写成一个类，这样做到目的一是为了符合前端需求，二是为了不暴露数据库不应该暴露的数据，比如用户信息的DO中一般都存在用户名和密码，在传输中DTO也可能会有这写属性，但是这些属性是不是适合传递给前端的，所以就需要VO来规定传输格式了。


### 功能解耦

解耦其实是非常重要一环，解耦的好决定了代码的灵活，服用性高，那么怎解耦呢。
比如这次遇到的api文档中需要生成swagger json文件然后同步到Yapi上面去。一开是我是写在一起的，但是后来仔细思考，生成swagger json 文件和同步Yapi其实是两个动作。如果以后需要其他api工具生成json文件，再同步，那原来的方法就不能使用了，还需要重新写一个方法。这显然是不利于开发的，所以正确的做法应该是把这两个方法拆开解耦，一个方法只做一件事。当其中一个方法需要更换当时候，就不会影响到其他方法了。  
解耦的时候如果不知道从哪里解开，那可以先描述一下你要的事情而不是着急从代码着手怎么分割。    

比如：我要去麦当劳吃汉堡然后回家。  
解耦后就变成这两个方法：
- 去一个地方
- 吃东西
  
这样即使需求换成：我要去北京吃烤鸭然后去上海；也能使用刚刚那两个方法通过传递不同的参数就好了。
