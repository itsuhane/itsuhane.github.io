---
layout: post
title: "矩阵的 Schur 补"
date: 2016-12-12 09:00:58 GMT
tags:
- linear algebra
- schur complement
comment: true
---
在线性方程求解中，有一个重要的技巧叫做 Schur 补。

设分块矩阵 $A=\begin{pmatrix}A_{11}  &  A_{12} \\  A_{21} & A_{22}\end{pmatrix}$ ，其中 $A_{11}$ 可逆。在线性方程 $Ax=b$ 中，对 $x$ 和 $b$ 以兼容的方式分块，可以得到：

$$
\begin{pmatrix}
A_{11} & A_{12} \\
A_{21} & A_{22}
\end{pmatrix}
\begin{pmatrix}
x_1 \\
x_2
\end{pmatrix}
=
\begin{pmatrix}
b_1 \\
b_2\end{pmatrix}.
$$

如果对 $A$ 进行高斯消元，利用块状行变换消去 $A_{21}$ ，上面的等式可以变形为：

$$
\begin{pmatrix}
A_{11} & A_{12} \\
0 & A_{22}-A_{21}A_{11}^{-1}A_{12}
\end{pmatrix}
\begin{pmatrix}
x_1 \\
x_2
\end{pmatrix}
=
\begin{pmatrix}
b_1 \\
b_2-A_{21}A_{11}^{-1}b_1
\end{pmatrix}.
$$

这样，第二行就变成了一个变量更少的线性方程：

$$
(A_{22}-A_{21}A_{11}^{-1}A_{12})x_2 = b_2- A_{21}A_{11}^{-1}b_1.
$$

在一些场合，可以先求解这一线性方程得到 $x_2$ ，然后代入到第一行再求解出 $x_1$ 。

这里出现了一个矩阵 $S = A_{22}-A_{21}A_{11}^{-1}A_{12}$ ，它被称为矩阵 $A$ 关于 $A_{11}$ 的 Schur 补，也记作 $A/A_{11}$，而这个方程求解的方法被称为 Schur 补技巧。

如果使用 Schur 补技巧来求解上面的方程，通常要求 $A_{11}$ 可逆且比较容易求逆。在一些问题中，我们的矩阵可以分块使得 $A_{11}$ 为（块）对角矩阵，这样允许我们很容易求出 $A_{11}^{-1}$ 。此外，其它的分块应当充分稀疏，从而允许我们加速 Schur 补的计算和求解新的线性系统。如果 $A_{11}$ 很大，对应着 Schur 补比较小，即使它相对更加稠密，求解的开销也会远远小于直接求解整个问题。
