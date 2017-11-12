---
layout: post
title: "最小二乘问题（十三）"
date: 2017-01-09 09:00:43 GMT
tags:
- least squares
---

我们考虑一种情况：优化过程中，如果我们要固定某一个变量的值，问题需要如何改变。

为了方便研究，对于一般的最小二乘问题，我们把它所有项的残差向量 $r_i$ 纵向连接成一个残差向量 $r$ ，得到下面的最小二乘问题：

$$
\min \|r(x_1, x_2, \dots, x_n)\|^2
$$

我们用 $J_i$ 表示 $r$ 关于 $x_i$ 的 Jacobian 矩阵。那么这个问题的标准方程就是：

$$
\begin{pmatrix}
J_1^TJ_1 & J_1^TJ_2 & \cdots & J_1^TJ_n \\
J_2^TJ_1 & J_2^TJ_2 & \cdots & J_2^TJ_n \\
\vdots & \vdots & \ddots & \vdots \\
J_n^TJ_1 & J_n^TJ_2 & \cdots & J_n^TJ_n
\end{pmatrix}\begin{pmatrix}
\Delta x_1 \\
\Delta x_2 \\
\vdots \\
\Delta x_n
\end{pmatrix} = 
-\begin{pmatrix}J_1^T \\ J_2^T \\ \vdots \\ J_n^T\end{pmatrix} r.
$$

假如我们希望将某个变量固定，不失一般性地，设这个变量为 $x_1$ 。由于新的优化问题中 $x_1$ 被视为常量，$r$ 的 Jacobian 矩阵将不包含 $J_1$ 项。新的优化问题的标准方程就是：

$$
\begin{pmatrix}
J_2^TJ_2 & \cdots & J_2^TJ_n \\
\vdots & \ddots & \vdots \\
J_n^TJ_2 & \cdots & J_n^TJ_n
\end{pmatrix}\begin{pmatrix}
\Delta x_2 \\
\vdots \\
\Delta x_n
\end{pmatrix} = -\begin{pmatrix}J_2^T \\ \vdots \\ J_n^T\end{pmatrix} r.
$$

这个结论可以自然地向固定任意多个变量推广，当我们要固定某些变量时，只需要求解未固定变量对应的区块的子线性系统。

让我们再来看这个线性的子问题，上述的固定实际上可以看成“令 $\Delta x_1 = 0$ ”，这么一来，我们的线性最小化问题中，与它有关的系数就全都不见了。

一般地，如果我们有线性最小化问题 $\min_{x,y} \\|(A_1 \; A_2){x \choose y}-b\\|^2$。如果我们选择固定 $x=x_0$ ，这个问题就变成了 $\min_y \\|A_2y+(A_1x_0-b)\\|^2$ ，它的标准方程也会对应地改变。我们可以换一种说法，把这个新的问题叫做“以 $x=x_0$ 为条件时的最小化”，这种操作也因此叫做条件化。
