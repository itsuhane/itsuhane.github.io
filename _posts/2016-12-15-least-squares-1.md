---
layout: post
title: "最小二乘问题（一）"
date: 2016-12-15 09:01:02 GMT
tags:
- least squares
comment: true
---

最小二乘问题是一类应用广泛的优化问题，它的理论比较成熟，数学和物理背景也很具体。

最基础也是最关键的一种最小二乘问题便是线性最小二乘问题。线性最小二乘问题具有如下形式：

$$
\min_x \\|Ax-b\\|^2.
$$

在这里，矩阵 $A \in \mathbb{R}^{m\times n}$，且 $m\geq{}n$，$\mathrm{rank}A = n$ 。

因为 $\\|Ax-b\\|^2 = (Ax-b)^T(Ax-b)$ ，对它关于 $x$ 求导并应用连续函数极值的条件，即导数为零，得到

$$
A^TA x - A^Tb = 0 \text{ 或者 } A^TAx = A^Tb.
$$

这个方程的解对应了前面最小二乘问题的最优解。这个方程也被叫做最小二乘问题的标准方程（Normal equation）。
