---
title: “阈值”优化
date: 2017-11-20 13:53:39
tags:
- Optimization
---
有时我们想求一系列数值 $f_1, f_2, \dots, f_n$ 中绝对值大于 $\lambda$ 的部分，如何非常有逼格地做这件事儿呢？

有趣的是，下面的优化解答了这一问题，其中 $f=(f_1, f_2, \dots, f_n)^T$ 是这些数值构成的列向量：

$$
\min \frac12\|x-f\|_2^2+\lambda\|x\|_1
$$

求解令上面问题最优的 $x$ ，则 $x$ 中非零项所在的维度便对应了想要的 $f_i$ 所在的维度。更具体地说，$x_i = \mathrm{sgn}(f_i)\cdot\max(\|f_i\|-\lambda, 0)$ 。这个操作等于**将 $f$ 的所有元素向零方向收缩 $\lambda$**，因此得名  shrinkage 。

{% include assets/image url="/2017-11-20-thresholding-optimization.png" %}

从这个看似简单的优化，可以扩展出很多复杂的数学工具，包括著名的 LASSO 和 SVT 算法。
