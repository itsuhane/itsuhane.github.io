---
layout: post
title: "CMake & Intel MKL 之黑魔法"
date: 2016-12-14 09:00:49 GMT
tags:
- CMake
- BLAS
comment: true
---


此前要在 CMake 下编译一个使用 Intel MKL 的库。

想让 CMake 顺利地找到需要的 MKL 简直是处处黑魔法，网上资料很少很零散很没用，全要靠自己摸爬滚打。这里记一下，方便我失忆之后参考。

我的 Intel MKL 版本是 2017.0 ，CMake 版本是 3.7.0 。

首先，MKL 提供了一个脚本用于设置需要的环境变量，这个脚本位于 mkl\bin 目录下，这里 mkl 目录是你的 Intel MKL 库的根目录。

在命令行下用这个脚本设置环境变量，像我要使用 Intel64 的版本，就是

    > mklvars Intel64

然后使用 cmake 命令生成用于编译的工程。但你以为就像下面这么简单么？

    > cmake -G “......”

错！CMake 会随便给你找一个能用的 MKL 配置就怼上去了。

后果是啥呢？其实也没啥，就是引用了一堆 DLL，然后部署你的程序的时候要拖家带口一顿搞……

根据我多次的经验，这个默认配置一般是 x64, TBB threaded, Dynamic linking 的版本。有些场合 Threading 会带来问题或者不能使用 TBB Threading 的时候，必须要修改这个配置，此外就是会有静态链接的需求。因此要给 CMake 教做人。

这时候就需要用到两个黑魔法变量了，这两个黑魔法变量在 FindBLAS.cmake 里有介绍（然而要用 CMake 还要去看自带的这些模块配置也是很迷……模块不能自带个提示信息么？）。这两个变量是：

BLA_STATIC - 一个布尔变量，顾名思义就是指明是用静态链接的。
BLA_VENDOR - 一个字符串，用来限定使用什么 BLAS 库。

至于怎么用，还是到 FindBLAS.cmake 里看一下吧……谁知道下一个 CMake 版本里会不会改。

哎就说这么多吧，心累。
