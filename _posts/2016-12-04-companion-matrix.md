---
layout: post
title: 多项式的伴随矩阵
date: 2016-12-04 09:00:00
tag:
- algebra
comment: true
---

很久之前学到的知识，但是今天回忆起来发现已经忘记了，这里记录一下。

一个多项式 $P(x) = x^n+c_{n-1}x^{n-1}+c_{n-2}x^{n-2}+\cdots+c_1x+c_0$ 的伴随矩阵（Companion Matrix）定义为：

$$
M_x = \begin{pmatrix}
0 & 0 & \cdots & 0 & -c_0 \\\
1 & 0 & \cdots & 0 & -c_1 \\\
0 & 1 & \cdots & 0 & -c_2 \\\
\vdots & \vdots & \ddots & \vdots & \vdots \\\
0 & 0 & \cdots & 1 & -c_{n-1}
\end{pmatrix}.
$$

可以证明，$P(x)$ 的根是 $M_x$ 的特征值，下面简单描述思路。

对于任意的多项式 $F(x)$ ，考虑多项式求余 $F(x)\mod P(x)\equiv R(x)$ 。当 $x_0$ 是 $P(x)$ 的根时，便有 $F(x_0)=R(x_0)$ 。

现在考虑新的多项式 $xF(x)$ ，同样关于 $P(x)$ 求余，记 $xF(x)\mod P(x)\equiv S(x)$ 。由于 $R(x)$ 和 $S(x)$ 不超过 $n-1$ 次，用两个 $n$ 维向量 $r, s\in\mathbb{R}^n$ 分别表示它们的系数。

观察 $R(x)$ 和 $S(x)$ 的系数向量的关系，将 $r \mapsto s$ 的关系记为 $M$ ，容易发现 $M$ 是一个线性映射，它的矩阵表达恰好是 $M_x$ 。

那么，当 $x_0$ 是 $P(x)$ 的根时，$F(x_0) = R(x_0)$ ，$x_0F(x_0) = x_0R(x_0) = S(x_0)$ 。

上面得到的等式关系对于任意 $P(x)$ 的根都是成立的，这意味着 $x_0R(x)$ 和 $S(x)$ 对应项的系数相等，即 $x_0r = s = M_x r$ 。

由此可知 $x_0$ 是 $M_x$ 的特征值。
