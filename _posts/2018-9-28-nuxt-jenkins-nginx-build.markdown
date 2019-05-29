---
layout: post
title: "nuxt+jenkins+nginx自动集成发布"
subtitle: ""
date: 2018-09-27 12:00:00
author: "左手喝水"
header-img: "img/post-bg-2015.jpg"
tags:
  - 集成
---

> “自从学会了这套技能，每天都准时回家了”

### 简介

[Nuxt](https://nuxtjs.org/)：基于 vue 的前端框架，比 vue-cli 更少的配置上手度较好

[jenkins](https://jenkins.io/)：自动构建、部署工具

[nginx](http://nginx.org/)：高性能的反向代理，负载均衡服务

nuxt 也可以换成其他框架如 vue-cli、Next、webpack 打包的项目或者是一些静态页面

### 准备

- 一台服务器(我的是 centos 系统)
- 一台电脑
- 一个你想发布的项目
- 项目的 github（或码云等其他代码托管仓库）

### 环境配置

服务器需要以下环境：java、node、jenkins、nginx、git

- java 安装  
   `yum -y install java` 执行下面的命令安装  
   `java -version` 安装完成以后查看一下版本，有版本显示就表示安装成功了

- node 安装  
   `curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -`  
   选择 10.x 版本  
   `sudo yum -y install nodejs` 安装 node  
   `node -v`查看 node 版本  
   `npm -v`查看 npm 版本  
   都有版本显示表示安装成功

- jenkins 安装  
  `yum install jenkins`

- nginx 安装  
  `yum -y install nginx`

- git 安装：  
  `yum –y install git`

如果以上都完成就可以进入各个工具的配置，没错就是那么麻烦。。。

### jenkins+码云 配置

首先启动 jenkins 服务 `sudo service jenkins start`  
成功启动你就会看到 `Starting Jenkins [ OK ]`  
浏览器打开 8080 端口就可以看到 jenkins 启动画面啦  
jeknins 会要求输入初始密码，根据图中地址找到密码文件，把密码输入
![jenkins-password](/blog/img/in-post/nuxt-jenkins-nginx/jenkins-password.png)
选择默认插件安装就好
![jenkins-init](/blog/img/in-post/nuxt-jenkins-nginx/jenkins-init.png)
创建管理员账号
![jenkins-add](/blog/img/in-post/nuxt-jenkins-nginx/jenkins-add.png)
完成后进入 jenkins 主页  
然后先装一下 webHook 插件（用来触发 git push 时钩子）
![jenkins-plugins](/blog/img/in-post/nuxt-jenkins-nginx/jenkins-plugin.png)  
在系统用户管理中找到用户的 UserID 和 Api token，记录一下待会用来配代码托管平台
![jenkins-token](/blog/img/in-post/nuxt-jenkins-nginx/jenkins-token.png)

这时候 jenkins 先放一下，来到你的代码托管平台找到你的项目，我用的是码云就用他来举例了  
在项目中找到 管理>webHooks 进入 webhooks 设置点击添加在 POST 地址框中输入以下规则内容

```md
http://<User ID>:<API Token>@<Jenkins IP 地址>:端口/generic-webhook-trigger/invoke
```

User ID:刚刚记录的 UserID
API Token:刚刚记录的 API Token
Jenkins IP 地址：服务器 IP，不能用域名
端口：jenkins 端口

提交后测试一下，status ok 就设置成功了，码云这边就弄完了

```json
{
  "status": "ok",
  "data": {
    "triggerResults": {
      "blog": {
        "id": 18,
        "regexpFilterExpression": "",
        "regexpFilterText": "",
        "resolvedVariables": {},
        "triggered": true,
        "url": "queue/item/18/"
      }
    }
  }
}
```

回到 jenkins 新建一个项目，选第一个自由风格的就可以。  
设置源码管理

![jenkins-config](/blog/img/in-post/nuxt-jenkins-nginx/jenkins-config-1.jpg)

勾一下 webhook
![jenkins-config](/blog/img/in-post/nuxt-jenkins-nginx/jenkins-config-2.png)

获得代码后执行的命令设置一下，这个和项目中的 packageJson 有关，我使用了 nuxt 的静态部署就是这两条了
![jenkins-config](/blog/img/in-post/nuxt-jenkins-nginx/jenkins-config-3.png)

jenkins 到这里配置就结束，剩下的就会方便一些了

### nuxt 项目配置

主要配置一下项目的 baseUrl 和之后 nginx 匹配的规则一致  
找到 nuxt.conf.js 设置一下 router，我这里判断了一下环境，dev 的时候对应环境名叫“development”，此时不会增加根路由，其他环境就会添加 project 作为根路由，nginx 匹配到了 project 就会代理到项目了  
nuxt.config.js

```js
router: {
    base: process.env.NODE_ENV === 'development' ? '/' : '/project/'
    },
```

package.json

```json
"scripts": {
    "dev": "cross-env NODE_ENV=development nuxt",
    "build": "cross-env NODE_ENV=production nuxt build",
    "start": "nuxt start",
    "generate": "nuxt generate",
    "lint": "eslint --ext .js,.vue .",
    "precommit": "npm run lint"
  },
```

请求配置：  
开发的时候前后端分离一般会用 nuxt 做 api 代理转发，我们使用 nuxt generate 静态部署就 nuxt 不会代理了，需要配置 nginx 来做代理
如果原来 api 请求路径是 /url/xxx
那么给请求统一加上 api 为根路径作为识别 api/url/xxx

### nginx 配置

jenkins 配完了接下来就是 nginx 了  
nginx 文件目录在/etc/nginx/  
为了以后可能会代理多个项目我再该目标下新建了 vhost/web.conf 文件，在 nginx.conf 中使用 include vhost/web.conf 引入 vhost 目录下所有的.conf 文件，这也是常规做法，然后再 web.conf 中配置反向代理  
nginx.conf

```md
# For more information on configuration, see:

# \* Official English Documentation: http://nginx.org/en/docs/

# \* Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.

include /usr/share/nginx/modules/\*.conf;

events {
worker_connections 1024;
}
http {
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
'"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;


    include vhost/web.conf;

}
```

web.conf

```md
upstream api{ #代理 api
server 127.0.0.1:3000 max_fails=1 fail_timeout=15s; #代理服务端地址
keepalive 64;
}

server {
listen 80; #监听端口
server_name xxxx.cn; #服务器域名
location ^~/project { #代理页面资源
alias /var/lib/jenkins/workspace/project/dist; #Jenkins 执行完命令后的路径
try_files $uri $uri/index.html =404;
}
location ^~/api { #代理请求
proxy_next_upstream error timeout http_503;
proxy_pass http://api; #代理
proxy_redirect off;
proxy_store on;
proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
client_max_body_size 20m;
proxy_ignore_client_abort on;
client_body_buffer_size 16k;
proxy_connect_timeout 200;
proxy_send_timeout 200;
proxy_read_timeout 200;
proxy_buffer_size 8k;
proxy_buffers 8 8k;
proxy_busy_buffers_size 8k;
proxy_temp_file_write_size 8k;
proxy_intercept_errors on;
#expires max;
#add_header Cache-Control "public, must-revalidate, proxy-revalidate";
add_header X-Frame-Options SAMEORIGIN;

    }

}
```

完成后保存一下  
检查配置是否正确 `nginx -t`  
如果 nginx 服务已经在跑了重启一下 `nginx -s reload`  
没启动的话启动一下：`server nginx start`  
ok，浏览器打开 域名/project 应该就能看到页面，配置就全部完成，恭喜  
现在每次代码 push 都会自动部署到服务器上了，不用每次打开 jenkins 去跑了任务了，针对密集型测试环境就会显的特别方便，是不是能早点回家了呢~
