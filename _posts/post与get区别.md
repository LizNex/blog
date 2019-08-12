---
layout: post
title: "Post Get 区别"
subtitle: ""
date: 2018-09-27 12:00:00
author: "左手喝水"
header-img: "img/post-bg-2015.jpg"
tags:
  - 网络
---

## Post Get 区别

浏览器层面

- Get 产生的url可以被书签储存
- Get 会被浏览器主动cache，Post不会cache
- Get 只能url编码，Post都可以
- Get 请求在传输有长度限制， Post没有限制
- Get 只接受ASCII编码，Post没有限制
- Get url参数直接暴露在url上
- Get 放在url传输，post在Request body中

网络层面

- 都是使用TCP协议传输
- Post请求有2个TCP包，Get请求只有一个；原因是Post会先发送一个header，服务器响应100 continue 浏览器再发送data，服务器响应200
 ok；所以Post会比Get更加可靠，性能上多一个TCP包基本可以忽略不计
