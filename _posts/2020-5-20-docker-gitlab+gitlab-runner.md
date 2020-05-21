---
layout: post
title: "docker gitlab-CI/CD"
subtitle: ""
date: 2020-5-20 12:00:00
author: "左手喝水"
header-img: "img/post-bg-2015.jpg"
tags:
  - 工具
---

# docker gitlab-CI/CD

## environment

git-runner: 12.10.2
git-lab: 12.10.6
docker: 19.03.8
docker Desktop: 2.3.0.2

## 流程

1. 安装 docker 环境：<https://www.docker.com/products/docker-desktop>
2. 安装 `gitlab-ce` 镜像

```bash
  sudo docker run --detach \
  --publish 8443:443 --publish 8090:80 --publish 8022:22 --name gitlab \ # 映射端口
  --restart always \
  --hostname 192.168.225.75 \ # 域名
  --privileged=true \ # root权限
  -v ~/srv/gitlab/etc:/etc/gitlab \ # 映射配置目录
  -v ~/srv/gitlab/logs:/var/log/gitlab \ # 映射配置目录
  -v ~/srv/gitlab/data:/var/opt/gitlab \ # 映射配置目录
  gitlab/gitlab-ce:latest # 指定获取镜像
```

3. 安装 `gitlab-runner` 镜像

   [gitlab-runner 参考 安装参考](#参考)

4. 准备 `.gitlab-ci.yml` 文件

```yml
stages: # 设置state
  - prepare
  - dev
  - build

prepare_before: # 设置job
  stage: prepare # job 所在 state
  script: # 执行的命令行
    - echo enter prepareBefore job !
prepare_after:
  stage: prepare
  script:
    - echo enter prepareAfter job !
dev:
  stage: dev
  script:
    - print enter dev job !
build:
  stage: build
  script:
    - print enter build job !
```

## 注意

- `gitlab` 安装的时候目录要选择 User 目录下的（也就是~），根目录（/）可能没有访问权限
- `gitlab` 如果不是默认 80 端口需要在 docker 容器里修改 gitlab 配置。参考:[docker 本地部署](#参考)
- `gitlab-runner` 注册完成以后要到 `gitlab` 中查看配置状态，绿色表示注册 ok
- 本地起服务要注意如果不同 docker 之间是用 ip 通信，那么换了网络是之后 ip 地址变换需要跟着改，比较麻烦。
- `pipline`的关系是:只有一个pipline， pipline 包含多个 stage ，stage 包含多个 job
  

## 参考

docker 本地部署 gitlab+runner: <https://juejin.im/post/5ea6a0535188256d8e65478d>
gitlab docker 安装：<https://www.cnblogs.com/supur/p/11594605.html>
gitlab-runer 安装 :<https://www.jianshu.com/p/ced7fb1d436b>
