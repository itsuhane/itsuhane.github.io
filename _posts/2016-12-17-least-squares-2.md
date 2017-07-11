---
layout: post
title: "最小二乘问题（二）"
date: 2016-12-17 09:00:59 GMT
tags:
- least squares
comment: true
---

上一回我们介绍了最朴素的最小二乘问题。现在我们对它进行一些变形，来得到“新”的最小二乘问题。

前面的问题中，只有一项，如果我们关于相同的变量添加一个新项，得到：
$$
\min_x \|Ax-b\|^2 + \|Cx-d\|^2.
$$

我们引入个新的矩阵 $M = \begin{pmatrix}A\\C\end{pmatrix}$，把 $b$ 和 $d$ 连接成 $w=\begin{pmatrix}b\\d\end{pmatrix}$ 。那么上面的问题等价于
$$
\min_x \|Mx-w\|^2.
$$

如果我们增加了含有新的变量的项呢？例如
$$
\min_{x,y} \|Ax-b\|^2+\|Cy-d\|^2.
$$

我们同样构造一个新的分块矩阵 $M=\begin{pmatrix}A & 0 \\ 0 & C\end{pmatrix}$ ，将变量 $x$ 和 $y$ 也连接成一个向量 $v=\begin{pmatrix}x \\ y\end{pmatrix}$ ，类似地把 $b$ 和 $d$ 也连接成 $w=\begin{pmatrix}b\\d\end{pmatrix}$ 。那么这个问题等价于
$$
\min_v \|Mv-w\|^2.
$$

除了上述的情形，我们还可能面对同时含有两个变量（或者多个）的项，比如
$$
\min_{x, y} \| Ax+By-c \|^2.
$$

同样连接 $x$ $y$ 为 $v$，记矩阵 $M = \begin{pmatrix}A & B\end{pmatrix}$ ，于是它等价于 $\min_v \\|Mv-c\\|^2$ 。
