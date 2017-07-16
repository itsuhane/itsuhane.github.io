---
layout: post
title: "Kalman Filter（二）"
date: 2017-01-17 09:00:47 GMT
tags:
- Kalman filter
comment: true
---

继续上文，我们来边缘化 $x_{k-1}$ 。我们将上文中优化的标准方程写出来：

$$
\begin{pmatrix}
R_k^{-1} & -R_k^{-1}H_k & 0 \\
-H_k^TR_k^{-1} & H_k^TR_k^{-1}H_k+Q_k^{-1} & -Q_k^{-1}F_k \\
0 & -F_k^TQ_k^{-1} & F_k^TQ_k^{-1}F_k+P_{k-1}^{-1}
\end{pmatrix}\begin{pmatrix}z_k \\ x_k \\ x_{k-1} \end{pmatrix} = \begin{pmatrix}
0 \\
Q_k^{-1}B_ku_k \\
P_{k-1}^{-1}\hat{x}_{k-1|k-1}
\end{pmatrix}
$$

边缘化 $x_{k-1}$ 对应于用 $Q_k^{-1}F_k(F_k^TQ_k^{-1}F_k+P_{k-1}^{-1})^{-1}$ 乘上第三行后加到第二行上。这么做之后，经过一系列（耐心的）整理后，可以得到下面的边缘化标准方程：

$$
\begin{pmatrix}
R_k^{-1} & -R_k^{-1}H_k \\
-H_k^TR_k^{-1} & H_k^TR_k^{-1}H_k+P_{k|k-1}^{-1}
\end{pmatrix}\begin{pmatrix}z_k \\ x_k \end{pmatrix} = \begin{pmatrix}
0 \\
P_{k|k-1}^{-1}\hat{x}_{k|k-1} \\
\end{pmatrix}
$$

这里 $$\hat{x}_{k\|k-1} = B_ku_k+F_k\hat{x}_{k-1\|k-1}$$ 是已知 $x_{k-1}$ 的概率分布时 $x_k$ 的后验概率分布的期望；而 $$P_{k\|k-1} = F_kP_{k-1}F_k^T+Q_k$$ 是它的协方差。

如果将上面的式子左侧进行块状 LDL 分解并依此进行整理，我们可以发现这个边缘化标准方程对应了一个新的（边缘化）最小二乘问题：

$$
\min \left\|\begin{pmatrix}I & -H_k \\ 0 & I\end{pmatrix}\begin{pmatrix}z_k \\ x_k\end{pmatrix}-\begin{pmatrix}0 \\ \hat{x}_{k|k-1}\end{pmatrix}\right\|_{\Sigma_{k|k-1}^{-1}}^2
$$

这里的 $\Sigma_{k\|k-1}$ 是什么不妨自己根据前面的推导来观察一下。

此时，只要再条件化 $z_k$ ，我们就可以求解此时最优的 $x_k$ 了。不过在此之前我们先整理一下思路：

- 我们知道了 $x_{k-1}$ 的分布；
- 我们把 $x_{k-1}​$ 的分布利用边缘化“浓缩”进了 $x_k​$ 。

如果此后 $x_{k-1}$ 不再发生任何的改变，那么我们这种“浓缩”便是准确的。但是我们会看到，在很多问题里，我们会得到关于 $x_{k-1}$ 的新信息，这时这么做就会丢失掉这些有用的信息。这也是 Kalman Filter 的缺点，但是要想完全避免这个问题是很难的，也是研究的一个重点。
