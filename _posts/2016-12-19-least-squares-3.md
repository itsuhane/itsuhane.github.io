---
layout: post
title: "最小二乘问题（三）"
date: 2016-12-19 09:01:00 GMT
tags:
- least squares
comment: true
---

上回介绍了三种（线性）最小二乘问题的变形，我们采用了相同的手段，就是构造出新的系数矩阵，然后将原始的问题变成新的系数矩阵下的单项的最小二乘问题。

从上文的三个问题稍加总结，便可以看出原始问题中的系数矩阵在新的系数矩阵里有这样的关系：

* 每一项的系数矩阵单独占据一行
* 每个变量的系数矩阵单独占据一列

同时，原始问题中的常数向量直接纵向连接便得到等价问题中的常数向量。

根据这个规则，下面我们介绍一般的多个二次项，多变量的最小二乘问题，以及如何将它化为单个二次项，单变量的最小二乘标准形式。

设一系列残差函数 $r_i(x_1, x_2, \dots, x_n) = \sum_j^n A_{ij} x_j - b_i$ ，$i = 1\dots m$ 。一个一般的线性最小二乘问题具有如下的形式：

$$
\min_{x_1, x_2, \dots, x_n} \sum_i^m \|r_i\|^2.
$$

定义系数矩阵 $A$ 、常数向量 $b$ 以及向量 $x$，分别为：

$$
\begin{aligned}
A &= \begin{pmatrix}
A_{11} & \cdots & A_{1n} \\
\vdots & \ddots & \vdots \\
A_{m1} & \cdots & A_{mn}
\end{pmatrix} & b &= \begin{pmatrix}
b_1 \\ \vdots \\ b_m
\end{pmatrix} &  x &= \begin{pmatrix}
x_1 \\ \vdots \\ x_n
\end{pmatrix} 
\end{aligned}
$$

那么上面的最小二乘一般形式可以转化为如下的标准形式：

$$
\min_x \|Ax-b\|^2.
$$

于是我们兜了个大圈子又回来了……
