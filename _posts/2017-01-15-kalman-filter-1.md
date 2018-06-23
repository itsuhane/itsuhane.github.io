---
layout: post
title: "Kalman Filter（一）"
date: 2017-01-15 09:00:42 GMT
tags:
- Kalman filter
comment: true
---

Kalman Filter 是一种用途非常广泛的参数估计方法。毫不过分地说，它是当今参数估计中的 The Golden Standard Method 。相关的文献、参考资料也很多了，这里我们不再详细介绍这些基本知识。

参考 [Wikipedia](https://en.wikipedia.org/wiki/Kalman_filter) 上关于 Kalman Filter 的相关数学符号，设一个离散线性系统的状态迁移方程和观测方程为

$$
\begin{aligned}
x_k &= F_k x_{k-1} + B_k u_k + w_k \\
z_k &= H_k x_k + v_k.
\end{aligned}
$$

已知 $x_{k-1} \sim N(\hat{x}\_{k-1\|k-1}, P_{k-1})$ 、$w_k \sim N(0, Q_k)$ 、$v_k \sim N(0, R_k)$ 、$u_k$ 时 ，系统中未知的 $x_k$ 和 $x_{k-1}$ 的真值的最大后验概率估计对应于下面的最小二乘的解：

$$
\min \|x_{k-1}-\hat{x}_{k-1|k-1}\|_{P_{k-1}^{-1}}^2+\|x_k - F_k x_{k-1} - B_k u_k\|_{Q_k^{-1}}^2+\|z_k-H_kx_k\|_{R^{-1}}^2
$$

调整变量和余项的顺序，将它们合并成矩阵表示，我们可以得到

$$
\min \left\|\begin{pmatrix}
I & -H_k & 0 \\
0 & I & -F_k \\
0 & 0 & I
\end{pmatrix}\begin{pmatrix}
z_k \\
x_k \\
x_{k-1}
\end{pmatrix} - \begin{pmatrix}
0 \\
B_k u_k \\
\hat{x}_{k-1|k-1}
\end{pmatrix}\right\|_{\Sigma^{-1}}^2.
$$

其中，$\Sigma = \mathrm{diag}(R_k, Q_k, P_{k-1})$.

上面的余项中有三行，我们从下向上来看的话就是：

- 第三行对应 $x_{k-1}$ 的先验概率
- 第二行对应 $x_{k-1}$ 和 $x_k$ 的联合概率
- 第一行对应 $x_k$ 和 $z_k$ 的联合概率

为什么要倒着看呢？因为它蕴含了 Kalman Filter 系统模型里的结构。注意到我们这里的问题中系数矩阵是一个下三角矩阵。把这个问题当做一个线性系统，那么在高斯消元的顺序下，我们应该是先求解 $x_{k-1}$ ，然后代入求解 $x_k$ ，最后再代入求解 $z_k$ （实际上我们并不会这么做，因为 $z_k$ 是已知量，我们要对它条件化）。

回忆前面介绍过的线性最小二乘求解时边缘化、条件化问题。$x_{k-1}$ 被边缘化了，可以独立于其它变量求解，这意味着在其它变量未知时，$x_{k-1}$ 的概率与其它变量无关。而 $x_k$ 的概率分布取决于 $x_{k-1}$ 。也就是说这其中存在一个因果关系（Causality），其中 $x_{k-1}$ 是因，$x_k$ 是果。

同样地，$x_k$ 到 $z_k$ 也存在着因果关系。这些因果关系对应了下面有向图中实线的部分，而它也对应了前面系数矩阵中所有对角线外的非零元：

{%include assets/image url="/2017-01-15-kalman-filter-1.png" %}

在 $z_k$ 已知时（也就是观测到了 $z_k$），我们便可以将其条件化，系统中剩余了 $x_{k-1}$ 和 $x_k$ 。如果同时将 $x_{k-1}$ 边缘化掉，剩下 $x_k$ ，我们就得到了 Kalman 滤波对 $x_k$ 的估计。
