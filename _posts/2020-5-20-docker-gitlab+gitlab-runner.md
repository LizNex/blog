---
layout: post
title: 'docker gitlab-CI/CD'
subtitle: ''
date: 2020-5-20 12:00:00
author: '左手喝水'
header-img: 'img/post-bg-2015.jpg'
tags:
  - 工具
---

# docker gitlab-CI/CD

## 概述

使用 gitlab 配合 gitlab-runner 完成 CI/CD；  
gitlab-runner 可以理解为一个在安装机器上的一个服务，和 gitlab 保持同通信接受到信号就开始任务；

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
  --publish 8443:443 --publish 8090:80 --publish 8022:22 --publish 8000:8000 --name gitlab \
  --restart always \
  --hostname 192.168.225.75 \
  --privileged=true \
  -v ~/srv/gitlab/etc:/etc/gitlab \
  -v ~/srv/gitlab/logs:/var/log/gitlab \
  -v ~/srv/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```

备注：privileged：root 权限

- `gitlab` 安装的时候目录要选择 User 目录下的（也就是~），根目录（/）可能没有访问权限
- `gitlab` 如果不是默认 80 端口需要在 docker 容器里修改 gitlab 配置。参考:[docker 本地部署](#参考)

3. 安装 `gitlab-runner`

可以用 docker 镜像安装`gitlab-runner` 但是最终打包会在镜像的容器里，如果要把打包内容发到本地还要配置共享目录，比较麻烦，这种情况考虑本地之间安装 runner。

runner 安装完成后需要注册，主要提供域名、token、执行的方式等等，参考下方链接；  
注册完成后要注意需要启动 `gitlab-runner start`

### 注意

- `gitlab-runner` 注册完成以后要到 `gitlab` 中查看配置状态，绿色表示注册 ok
- 在执行任务的时候使用`gitlab-runner` 这个用户身份执行，这个用户默认不是 root 权限要在
  `/etc/sudoers`这个文件里修改添加一行

  ```bash
   ## Allow root to run any command anywhere
   gitlab-runner ALL=(ALL) NOPASSWD: ALL
  ```

### 注意

- `gitlab` 安装的时候目录要选择 User 目录下的（也就是~），根目录（/）可能没有访问权限
- `gitlab` 如果不是默认 80 端口需要在 docker 容器里修改 gitlab 配置。参考:[docker 本地部署](#参考)

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

- 本地起服务要注意如果不同 docker 之间是用 ip 通信，那么换了网络是之后 ip 地址变换需要跟着改，比较麻烦。
- `pipline`的关系是:只有一个 pipline， pipline 包含多个 stage ，stage 包含多个 job

## 参考

docker 本地部署 gitlab+runner: <https://juejin.im/post/5ea6a0535188256d8e65478d>
