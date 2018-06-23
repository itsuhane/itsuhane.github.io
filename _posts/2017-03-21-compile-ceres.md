---
layout: post
title: "Ceres Solver 的编译"
date: 2017-03-21 09:00:53 GMT
tags:
- ceres solver
---

Ceres Solver 的编译比起 SuiteSparse 就更加需要耐心了。主要原因是它的依赖比较复杂。其中有两个要点：

1. Ceres Solver 依赖 SuiteSparse ，也就需要一个 BLAS/LAPACK 。
2. Ceres Solver 需要 glog ，否则性能会打折扣。

先说第二点，这个比较简单，从官网下载 glog 的代码，然后编译。我使用的是 Visual Studio 2015，于是 glog 的编译就不开心了。在向 Windows 移植的过程中，glog 自己实现了一些用来做 I/O 的函数，比如 snprintf ，VS2015 提供了兼容的函数，这就产生了冲突。解决的方法也很简单，把 glog 自带的禁掉。**或者从 github 的项目中下载最新的 commit，其中提供了 CMakeList 可供直接编译。**

然后来解决折磨人的小妖精 BLAS 。Windows + BLAS + CMake 永远是个难题，是个难题，是个难题（重要的问题说三遍）。原因有这么几个：

- BLAS 实现多又多，在 Windows 下好用的没几个
- CMake 的 findBLAS 和 findLAPACK 各种不好用
- 文档匮乏

关于 BLAS ，我使用了 Intel MKL，它的最新版本已经可以免费下载，并且在 “Wintel” 平台下性能基本上是最优的。因为 Ceres Solver 自己采用了 OpenMP 等 API 进行了并行处理，如果底层的 BLAS 也独自进行并行，可能会产生错误的行为，所以在 Ceres Solver 中使用 Intel MKL 必须要注意使用它的串行版本。

为了使用这一版本的 MKL，要到 [Intel® Math Kernel Library Link Line Advisor](https://software.intel.com/en-us/articles/intel-mkl-link-line-advisor/) 上获得应当链接的正确的库，参考配置如下图：

{% include assets/image url="/2017-03-21-compile-ceres-1.png" %}

与此同时，如果使用的是 MKL 的动态链接版本，日后使用 Ceres 的程序总是要带着各种 DLL 的小尾巴，显得很不方便。结合我自己的情况，我选择使用静态链接的版本，上图中对应了 Select dynamic or static linking: Static 。

接下来，来到 Ceres Solver 的编译，在 CMake （cmake-gui）中打开代码树并初次进行配置。接下来就会见到大量的提示，按部就班地配置好 glog 和 Eigen 的路径，我们开始怼 CMake 的 BLAS 配置。

首先，为了要让它出现 BLAS 的配置，我们需要告诉它“我要用 SuiteSparse！”，接下来 CMake 就会去找 SuiteSparse，然后发现它依赖 BLAS，然后发现找不到，然后来傻乎乎问你 BLAS 在哪儿，从而诱导出 BLAS 相关的配置。

{% include assets/image url="/2017-03-21-compile-ceres-2.png" %}

……但是故事远没有这么简单，一般情况下，你会发现 CMake 提示了各种 NOT FOUND……

{% include assets/image url="/2017-03-21-compile-ceres-3.jpg" %}

冷静，这个时候就需要一些小小的魔法，怎么做呢？在 CMake 的界面里点击那个 Add Entry，添加一个叫做 BLA_STATIC 的布尔值，设置为 True 。

这样便告诉了 CMake：我要使用静态版本的 BLAS 。加上这个之后，再不要忘记打开 SuiteSparse 的开关（之前没找到 BLAS ，于是 CMake 就自作主张给你关了……），重新配置。

……然后你会发现，旧的 NOT FOUND 还在，还出现了三个新的 NOT FOUND ……

{% include assets/image url="/2017-03-21-compile-ceres-4.jpg" %}

不过冷静对比一下，你会发现新出现的 NOT FOUND 恰好对应了我们在 Link Line Advisor 中得到的三个文件名。把这三个文件的完整路径对照填进去，再次打开 SuiteSparse ，配置。

{% include assets/image url="/2017-03-21-compile-ceres-5.png" %}

经过这么一番折腾，终于见到了曙光。如果一切正确的话，CMake 便会提示找到 BLAS 和 LAPACK，并为你打开 SuiteSparse 的相关配置（又是一大堆的路径等待你人肉）。全部添加好，再一次配置，如果全部通过，就可以生成用于编译的工程了。

关于如何在 CMake 里优雅的使用 MKL ，还可以参考我之前的一篇文章 [CMake & Intel MKL 之黑魔法]({{ site.baseurl }}/2016/12/14/cmake-and-mkl/) 。
