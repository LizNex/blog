---
layout: post
title: 'jenkins+linux+vue 发布流程'
subtitle: ''
date: 2020-6-8 12:00:00
author: '左手喝水'
header-img: 'img/post-bg-2015.jpg'
tags:
  - 运维
---

想要达成的目标：

1. 从指定gitlab获取代码
2. 构建
3. 单元测试
4. 部署
5. 连通性测试
6. 发布通知
7. 回滚

参数：

使用 docker 安装 jenkins
https://juejin.im/post/5db9474bf265da4d1206777e#heading-4

linux ssh 安装
<https://www.cnblogs.com/wholj/p/10676917.html>
