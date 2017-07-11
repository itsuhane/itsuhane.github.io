---
layout: post
title: "RefBLAS is Slow"
date: 2016-12-10 09:00:46 GMT
tags:
- BLAS
- linear algebra
comment: true
---

很多的数值应用在核心部分都依赖快速的线性代数计算，BLAS 为这些线性代数计算提供了基本的 Building Block 。然而当前存在着非常多的 BLAS 实现，其中作为参考实现的是 netlib 的 Reference BLAS（我们简称 RefBLAS）。最近发现我们的一些项目中，为了偷懒直接使用了 RefBLAS 。这种做法其实是非常不好的。

RefBLAS 采用了 FORTRAN 语言实现，其作用是明确了 BLAS 的接口定义和行为。但是 FORTRAN 在当今已经不是主流语言了，甚至在 Windows 平台上缺少高效且免费的 FORTRAN 编译器。

RefBLAS 的实现是非常通用的，这就意味着它不会照顾到具体平台的具体特性，这其中就包括了寄存器使用、超标量加速、缓存预存取甚至专用数值指令等等可以带来巨大性能提升的特性。仅仅使用 RefBLAS 的话，等于是将优化寄托于编译器。

随着如今编译器的发展，使用纯&nbsp;C 语言编写的 BLAS 早就已经赶上甚至超过了 RefBLAS 的性能。也就是说，即使不采用更加针对性的优化，RefBLAS 相较于 C 编写的 BLAS 也没有特别的优势。

进一步的，当各种针对特定计算/访问模式的优化被加入之后，整体效率的提升就更加可观了！BLAS 在各种数值程序中处在非常核心的位置，在计算中占据了相当大的一部分比例，使用 RefBLAS 造成的性能浪费将会是非常严重的。

结论就在标题中了，RefBLAS 是很慢的，绝不能因为它的代码很容易下载到，就使用它。

下面列举一些先进的 BLAS 实现：
* Intel MKL (商业软件，且仅在 Intel CPU 上有最佳性能)
* BLIS
* ulmBLAS
* OpenBLAS
* ATLAS

