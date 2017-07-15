---
layout: post
title: "Kalman Filter（三）"
date: 2017-01-20 09:00:51 GMT
tags:
- Kalman filter
comment: true
---

我们接着条件化 $z_k$ 。从之前得到的经过边缘化的最小二乘问题，我们加入 $z_k = \bar{z}_k$ 的条件，得到：

$$
\min \left\|
\begin{pmatrix}
-H_k \\
I
\end{pmatrix}x_{k} - \begin{pmatrix}
-\bar{z}_k \\
\hat{x}_{k|k-1}
\end{pmatrix}
\right\|_{\Sigma_{k|k-1}^{-1}}^2
$$

它的标准方程是

$$
(H_k^TR_k^{-1}H_k+P_{k|k-1}^{-1})x_k = H_k^TR_k^{-1}\bar{z}_k+P_{k|k-1}^{-1}\hat{x}_{k|k-1}
$$

可以证明求解上述标准方程等价于 Kalman 滤波的更新迭代，我们这里不详细推导了。不过建议自己计算一下，在计算的过程中寻找到 Kalman 滤波对应的卡尔曼增益等相关系数。

结合前面几篇文章，我们实际上用另外一个思路进行了 Kalman 滤波。不难看出我们这个思路下许多计算与 Kalman 滤波原始的计算存在着比较大的差异。但是两种方法殊途同归。利用这里介绍的方法，可以设计另一种滤波的迭代策略，它通过跟踪标准方程的系数和常数部分来进行滤波，也被称为信息滤波（Information Filtering）。信息滤波中，如果进一步利用 LDL 分解的结构，可以设计出数值上更加稳定的平方根信息滤波（Square-Root Information Filtering, SRIF），这里就不再详细介绍了。
