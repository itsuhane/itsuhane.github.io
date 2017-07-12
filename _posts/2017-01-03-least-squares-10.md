---
layout: post
title: "最小二乘问题（十）"
date: 2017-01-03 09:00:44 GMT
tags:
- least squares
comment: true
---

在我们这一系列文章的最一开始，我们对标准形式的 $\min \\|Ax-b\\|^2$ 有着如下的要求：

$$
A\in \mathbb{R}^{m\times n}, m \geq n, \mathrm{rank}(A)=n.
$$

这其中对 $A$ 的满秩要求是非常重要的，因为我们优化这一问题的方式是求解标准方程，得到：

$$
A^TAx = A^Tb.
$$

结合前面的条件，我们知道方程有解当且仅当 $A^TA$ 可逆。而如果 $\mathrm{rank}(A)<n$ ，$\mathrm{rank}(A^TA)\leq\mathrm{rank}(A)<n$ 一定不可逆。

在秩亏的情形下，我们的解 $x$ 有无穷多，这是因为对于任意的 $z\in\mathrm{ker}(A^TA)$ ，$A^TA(x+z)=A^TAx$ 。此时，我们的问题是欠约束的。

为了解决秩亏问题，我们可以引入 $A$ 的伪逆 $A^\dagger$ 。将问题的解写作：

$$
x = A^\dagger b.
$$

利用 SVD 分解，若矩阵 $A=U\Sigma V^T$，则 $A^\dagger = V\Sigma^\dagger U^T$ ，这里 $\Sigma^\dagger = \mathrm{diag}(\mathrm{inv}(\sigma_1), \mathrm{inv}(\sigma_2), \dots, \mathrm{inv}(\sigma_n))$. 相比一般的矩阵求逆，由于秩亏矩阵存在为 0 的奇异值，我们特别引入了专用的倒数函数：

$$
\mathrm{inv}(x) = \begin{cases}1/x & x\neq 0, \\ 0 & x=0.\end{cases}
$$

我们回到原始的最小化问题，$Ax-b$ 几何上对应于求 $b$ 在 $A$ 的列空间上的投影，利用上面的 SVD 分解结果，我们知道 $U^T b$ 中对应非零奇异值的行便对应了这个投影，剩余的部分是垂直于 $A$ 列空间的余项（$Ax$ 永远无法表达的部分）。完整的 $A^\dagger b$ 恰好给出了不包含余项的部分，同时它在 $A$ 的右零空间投影也是零，所以它是对 $Ax-b=0$ 的最好逼近，同时也保证了 $\\|x\\|$ 最小。

有关上面内容的详细证明，可以参考其它资料，或者尝试自行推导。从结论上讲，$x=A^\dagger b$ 求解了下面的问题：

$$
\min \|x\|^2 \mathrm{\ s.t.\ } x\in\arg\min \|Ax-b\|^2.
$$

这种处理方法虽然可以解决任意的线性最小二乘，但它的缺点也是明显的：SVD 分解通常需要很大的运算量。通过观察问题的解，我们“希望”最小化原始问题的同时最小化 $x$ 的模长，这就诱使我们转而采用下面的带正则化最小二乘：

$$
\min \|Ax-b\|^2+\lambda\|x\|^2.
$$

它的标准方程为 $(\lambda I+A^TA)x = A^Tb$ ，当 $\lambda>0$ 时，$x$ 左侧的系数矩阵一定可逆。为了能够更好近似原始最小问题的结果，我们需要 $\lambda$ 尽可能小。否则我们就会在两项之间进行一个折衷，最终的结果并不能真正最小化 $\\|Ax-b\\|^2$ 。

但在非线性最小二乘中，我们会看到这一正则化会带来一种新的最小化算法。它可以保证我们收敛到局部最优，同时它比标准的 Gauss-Newton 具有更好的稳定性。
