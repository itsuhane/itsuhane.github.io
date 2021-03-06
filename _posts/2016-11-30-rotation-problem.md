---
layout: post
title: A Rotation Problem
date: 2016-11-30 09:00:01 GMT
tags:
- problem
- rotation
- linear algebra
comments: true
---

有朋友问了这么一个问题：已知旋转矩阵 $R_1$ 和 $R_3$ ，求旋转矩阵 $R_2$ ，使得

$$
R_1 R_2^T = R_2 R_3.
$$

看起来像是根据一些刚性变换关系求解未知的坐标系。

为了求解这个问题，设 $R_2 = R_x R_3^T$ 代入，得到 $R_1 R_3 R_x^T = R_x R_3^T R_3$ ，整理得到 $R_1 R_3 = R_x^2$ 。由此解得 $R_x = (R_1 R_3)^{1/2}$ 。故问题的解为

$$
R_2 = (R_1R_3)^{1/2} R_3^T.
$$
