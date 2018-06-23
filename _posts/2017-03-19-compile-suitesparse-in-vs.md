---
layout: post
title: "Visual Studio 下编译 SuiteSparse"
date: 2017-03-19 09:00:28 GMT
tags:
- C++
---
{% include assets/image url="/2017-03-19-compile-suitesparse-in-vs.jpg" %}

工程中要使用来自 Google 的 [Ceres Solver](http://ceres-solver.org/) 。它可选依赖于 SuiteSparse ，加入之后可以大幅提高大型稀疏系统求解速度。然而在 Windows + Visual Studio 中编译 SuiteSparse 并不是一个容易的事情。之前我进行了一次编译，这里记录一下，供日后参考。

SuiteSparse 是使用 C 语言编写，本身采用了 Makefile 进行编译。为了在 Windows 下进行编译，一种办法是安装一个带有 GNU Make 的环境，例如 Cygwin 。通过分析 Makefile 的内容，可以发现它基本上是将每个源代码文件编译后链接成一个库。是非常标准的做法，因此我们可以用 Visual Studio 来完成这个过程。但是 Visual Studio 自带的 C/C++ 工程并不支持 SuiteSparse 代码中用到的一种特殊技巧——基于宏的 C 代码模板。

在 SuiteSparse 中，经常出现下面的特殊用法：

``` cpp
#if defined(LONG)
#define Integer long long
#else
#define Integer int
#endif
```

此后，通过在编译时命令行加入宏定义来控制编译得到使用 `long long` 和 `int` 的两份二进制。这种技巧需要**对同一份源代码编译多次**。 Visual Studio 的 C/C++ 工程不支持多次编译，也就不能直接做这个事情。

解决这个问题的方法之一是为需要多次编译的代码**创建副本**，从而每个副本编译一次。为了避免大量的文件复制，可以在工程中创建下面这样的源代码文件：

``` cpp
#define LONG
#include "suitesparse_source.c"
```

当然建立工程时一定要检查每个 SuiteSparse 自带的 Makefile ，确认哪些源代码应用了宏模板，哪些只进行一次编译。

针对 SuiteSparse 4.5.3 版本，我用上面的方法建立了 Visual Studio 2015 的工程，请见 [SuiteSparse-MSVC](https://github.com/itsuhane/SuiteSparse-MSVC) 。利用它，可以不借助 GNU Make 完成 SuiteSparse 的编译。也就减少了部分配置环境的负担。

当然，这不是长久之计，更应该对 SuiteSparse 的项目管理工具进行升级，改用诸如 CMake 等的工具自动根据需要生成上面的包装代码文件。

（封面图来自 [Prof. Tim Davis](http://faculty.cse.tamu.edu/davis/) ）
