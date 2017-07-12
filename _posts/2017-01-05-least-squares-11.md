---
layout: post
title: "最小二乘问题（十一）"
date: 2017-01-05 09:01:03 GMT
tags:
- least squares
comment: true
---

我们来看非线性最小二乘问题的线性化子问题：

$$
\min_{\Delta x} \|J_r \Delta x+r(x)\|^2.
$$

假如我们不能保证 $J_r$ 列满秩，我们套用上一篇末尾的正则化方法，将这一子问题改写为：

$$
\min_{\Delta x} \|J_r \Delta x+r(x)\|^2+\lambda \|\Delta x\|^2.
$$

这时，我们在每一步迭代时便会在“尽可能最小化当前线性化函数”和“尽可能保持步伐稳健”之间进行折衷。那么这会影响到我们最终收敛到局部极值么？注意看，如果我们已经在局部极值附近，此时 $\\|\Delta x\\|^2\to 0$，也就是说第二项自然就消失了。换句话说，在局部极值点附近，我们的问题与 Gauss-Newton 中的线性化子问题是相同的。

再来看看这个常数 $\lambda$ ，当 $\lambda \to 0$ 时，我们得到了 Gauss-Newton，此时我们通过二阶近似来逼近目标函数。当 $\lambda \to \infty$ 时，根据标准方程

$$
(\lambda I + J_r^TJ_r)\Delta x = -J_r^T r \Rightarrow \Delta x \approx -\frac1\lambda J_r^Tr.
$$

这意味着，此时我们的优化步采用的是梯度下降步。

也就是说，通过调节 $\lambda$ ，我们的优化算法在 Gauss-Newton 步和梯度下降步之间平衡。此外，采用了这种方法后，在每次子问题求解后，更新变量时无需再采用步长控制，可以直接使用 $x\gets x + \Delta x$ 。 这是因为 $\lambda$ 自带了步长控制的效果。

这个方法被称为 Levenberg-Marquardt 算法，是一种广泛使用的非线性最小二乘问题的数值优化算法。

那么，吹了一篇 LM 算法，究竟什么时候要 GN 步，什么时候要梯度下降步呢？Jacobian 不满秩时 GN 有多糟糕呢？ 为啥 LM 就好了呢？ 我们下一篇介绍。
