---
layout: post
title: 'ansible'
subtitle: ''
date: 2020-7-13 12:00:00
author: '左手喝水'
header-img: 'img/post-bg-2015.jpg'
tags:
  - 运维
---

## ssh 连接

在目标机中添加 `.pub` 公钥文件，参考下面链接

## 命令

执行 playbook：`ansible-playbook install-node.yml`
执行playbook 询问sudo密码：`ansible-playbook install-node.yml -K`
获取 ansible 包: `ansible-galaxy install xxxx`
模块文档：`ansible-doc xxx`

参考:

- 官网中文文档：http://www.ansible.com.cn/docs/intro_configuration.html#environmental-configuration
- 入门教程:<https://juejin.im/post/6844904132290019335>
- ansible 包工具：https://galaxy.ansible.com/
- roles参考：https://www.cnblogs.com/yanjieli/p/10971862.html
- ssh 连接报错处理: <https://blog.csdn.net/Alex_Sheng_Sea/article/details/84028304?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522159644340419724839235398%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=159644340419724839235398&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v3~pc_rank_v3-1-84028304.pc_ecpm_v3_pc_rank_v3&utm_term=publickey%2Cgssapi-keyex%2Cgssapi-&spm=1018.2118.3001.4187f>
