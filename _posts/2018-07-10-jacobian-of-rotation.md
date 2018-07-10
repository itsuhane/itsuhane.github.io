---
title: 旋转变量求导
date: 2018-07-10 11:35:00 GMT
tags:
- Jacobian
- Geometry
---

在涉及空间三维运动的问题中经常会遇到含有旋转变量的能量，最优化这样的能量时，便需要对旋转变量进行求导。
在当前旋转的切空间上，运用李代数的方法进行局部求导已经是一种标准的做法，但其中推导比较复杂，不熟悉的话容易出错。
为此，这篇文章整理了一些常见的包含旋转变量的能量形式以及它们的导数。

## 基本方法

我们回避过于形式化的完整推导，采用一种仿照对偶数[^1]的简易推导方法。如果对于一个函数 $f$ 在点 $x$ 处有
$$
f(x)+\delta f = f(x+\delta x)
$$
其中，$\delta x$ 和 $\delta f$ 看作是微元或者对偶量，那么我们就可以从中提取 $\delta f/\delta x$ 作为 $f(x)$ 的导数。
从具体步骤上来说，首先在需要求导的点 $x$ 上添加微元 $\delta x$ 后应用函数 $f$ ，然后将其展开为 $f(x)$ 加上微元余项的形式，最后就可以提取导数了。

## 旋转小量

三维旋转只有三个自由度，然而它高度非线性，因而我们采用李代数的方法，在切空间中进行求导。这样一来，旋转小量便对应了三维的向量。旋转切空间的李代数到旋转的李群之间由**指数映射**和**对数映射**联系起来，对一个旋转 $R$ 添加小量微扰 $\delta R$ 可以表示为 $R\oplus \delta R = R\exp \delta R$ 。相对的，两个相近的旋转 $R_1$ 和 $R_2$ 之间的差可以表示为 $R_2 \ominus R_1 = \log(R_1^\top R_2)$ 。

此外，我们有一些有用的关系：

1. $\exp(\delta R) = I+[\delta R]_\times$
2. $\exp(\delta R)U = U\exp(U^\top\delta R)$
3. $\log(U\exp(\delta R)) = \log U + J_r^{-1}(\log U)\delta R$

注意由于 $\delta R$ 是微元，上面三个关系的等号可以认为成立，否则第一和第三个关系只在 $\delta R$ 比较小时近似成立。

## 常见基本形式的导数

### 1. 三维点的旋转

空间三维点的旋转对应于 $f_1(R) = Rx$ 或 $f_2(R) = R^\top x$ ，其中 $x$ 是三维常向量。以 $f_1$ 为例：

$$
\begin{align}
f_1(R\oplus\delta R) - f_1(R)
&= (R\exp\delta R)x-Rx \nonumber \\
&= R(I+[\delta R]_\times)x - Rx \nonumber \\
&= R[\delta R]_\times x \nonumber \\
&= -R[x]_\times \delta R
\end{align}
$$

因此，对应的导数为 $-R[x]_\times$ 。

下表为上述两个形式对应的导数：

| $f_i(R)$   | $[f_i(R\oplus\delta R)-f_i(R)]/\delta R$ |
| ---------- | ---------------------------------------- |
| $Rx$       | $-R[x]_\times$                           |
| $R^\top x$ | $[R^\top x]_\times$                      |

### 2. 旋转的复合

旋转的复合对应于 $f_3(R) = UR$ 、$f_4(R) = UR^\top$ 、$f_5(R) = RU$ 和 $f_6(R) = R^\top U$ 四种形式中的一种，其中 $U$ 为一个常量旋转。由于这四个形式最终结果是旋转，根据参数化方式的不同，结果的维度也不一样，我们转而在结果的切空间内求导，此时导数对应了 $3\times3$ 矩阵。结果的导数形式中，所有的旋转也相应采用其 $3\times3$ 矩阵形式表达，以 $f_5$ 为例：

$$
\begin{align}
f_5(R\oplus \delta R) \ominus f_5(R)
&= (R\exp (\delta R) U) \ominus f_5(R) \nonumber \\
&= (RU \exp (U^\top \delta R)) \ominus (RU) \nonumber \\
&= \log((RU)^\top RU\exp(U^\top\delta R)) \nonumber \\
&= U^\top\delta R
\end{align}
$$

因此，对应的切空间内的导数为 $U^\top$ 。
下表列出了上述四个形式对应的导数：

| $f_i(R)$   | $[f_i(R\oplus \delta R) \ominus f_i(R)]/\delta R$ |
| ---------- | ------------------------------------------------- |
| $UR$       | $I_{3\times 3}$                                   |
| $UR^\top$  | $-R$                                              |
| $RU$       | $U^\top$                                          |
| $R^\top U$ | $-U^\top R$                                       |

### 3. 旋转的差值

旋转的差值对应于 $f_7(R) = \log(UR)$ 、 $f_8(R) = \log(UR^\top)$ 、$f_9(R) = \log(RU)$ 和 $f_{10}=\log(R^\top U)$ 四种形式中的一种。以 $f_9$ 为例：

$$
\begin{align}
f_9(R\oplus\delta R)-f_9(R)
&= \log(R\exp(\delta R) U) - f_9(R) \nonumber \\
&= \log(RU\exp(U^\top\delta R)) - f_9(R) \nonumber \\
&= \log(RU)+J_r^{-1}(\log(RU))U^\top \delta R-f_9(R) \nonumber \\
&= J_r^{-1}(\log(RU))U^\top\delta R = J_r^{-1}(f_9(R))U^\top\delta R
\end{align}
$$

因此，对应的导数为 $J_r^{-1}(f_9(R))U^\top$ 。

下表列出了这四个形式对应的导数：

| $f_i(R)$         | $[f_i(R\oplus \delta R)-f_i(R)]/\delta R$ |
| ---------------- | ----------------------------------------- |
| $\log(UR)$       | $J_r^{-1}(f_7(R))$                        |
| $\log(UR^\top)$  | $-J_r^{-1}(f_8(R))R$                      |
| $\log(RU)$       | $J_r^{-1}(f_9(R))U^\top$                  |
| $\log(R^\top U)$ | $-J_r^{-1}(f_{10}(R))U^\top R$            |

在面对复合函数时，只要正确使用链式法则结合上面的导数，便可以得到想要的结果了。

[^1]: [Dual Number on Wikipedia](https://en.wikipedia.org/wiki/Dual_number)
