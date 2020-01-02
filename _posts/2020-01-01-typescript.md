---
layout: post
title: 'typescript'
subtitle: ''
date: 2020-01-01 12:00:00
author: '左手喝水'
header-img: 'img/post-bg-2015.jpg'
tags:
  - ts
---

## TypeScript

- never表示不会到达的代码，可以使用在报错函数的返回，或switch中默认判断以防遗留判断类型
- keyof 可以枚举类型的key
- typeof 可获得变量的类型
- 常用的内置泛型： 见参考（4）
- &表示交叉类型，| 表示合并类型
- is 可以约束入参类型，比强转要好
- 这里的never不太懂
  
```ts
type Exclude<T, U> = T extends U ? never : T;
type A = Exclude<'x' | 'a'| 'y', 'x' | 'y' | 'z'>;
```

参考：

1. TS高级技巧：https://juejin.im/post/5cffb431f265da1b7401f466
2. RoadMap（TS更新文档）：https://github.com/Microsoft/TypeScript/wiki/Roadmap
3. TS 文档：https://www.tslang.cn/docs/handbook/basic-types.html
4. TS 一些工具泛型的使用及其实现：https://zhuanlan.zhihu.com/p/40311981
5. is的理解:https://blog.csdn.net/weixin_33727510/article/details/87962412
