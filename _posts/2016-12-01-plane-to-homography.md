---
layout: post
title: 由平面引申出的射影变换
date: 2016-12-01 09:00:01 GMT
tags:
- geometry
comment: true
---

一个相机放在世界坐标系原点，相机坐标系与世界坐标系重合。空间中一个平面，这个平面在世界坐标系下的法线是 $n$ ，到世界坐标系原点距离为 $d$ 。平面上有一些点 $P_i$ ，我们可知 $\frac{1}{d}n^TP_i = 1$。

现在来了一个新相机，世界坐标系中的点到新相机坐标系中坐标的变换为 $Q_i = RP_i+T$ 。把上面的 1 乘到 $T$ 上并不影响这个式子的结果，但是我们将其转换成了一个关于 $P_i$ 的齐次变换，即

$$
Q_i = \left(R+\frac{1}{d}Tn^T\right) P_i.
$$

令 $H = R+\frac1dTn^T$ ，这个 $H$ 便给出了平面上的点在前后两个相机中的射影坐标对应的射影变换。

如果进一步令 $t = \frac1dT$，$H = R+tn^T$ ，式中 $\\|n\\|=1$ 具有两个自由度，$R$ 具有三个自由度，$t$ 具有三个自由度，由此得到 $H$ 的自由度为 3+3+2 = 8 。这个参数化的优点在于其几何意义明确，适合在进一步优化的时候使用。
