---
layout: post
title: "cookie、session、sessionStorage、localStorage区别"
subtitle: ""
date: 2020-02-25 12:00:00
author: "左手喝水"
header-img: "img/post-bg-2015.jpg"
tags:
  - html
---

## cookie,sessionStorage,localStorage区别

 方式 | 生命周期 | 接受类型|生成| 容量| 特点|
-------|--------|-----|----|---|---|
 cookie  | 若未设置过期时间，则保存在内存中，浏览器关闭后销毁。 <br> 若设置了过期时间，则保存在系统硬盘中，直到过期时间结束后才消失<br>(即使关闭浏览器）| string| 服务端| 4k|随请求自动发送，可以设置客户端只读，与服务端session对应
 sessionStorage | 浏览器关闭后失效 | string|客户端|5M|
 localStorage| 除非手动清理否则一直有效| string|客户端|5M| 
