---
layout: post
title: "从平面引申出的射影变换（二）"
date: 2017-03-17 09:00:22 GMT
tags:
- geometry
comment: true
---

最近各种事情比较忙，一直没有更新……接下来陆续恢复更新。

很久以前记过一篇[从平面得到两视图间射影变换的文章]({{ site.baseurl }}/2016/12/01/plane-to-homography/)。在那篇文章中，平面在第一个相机坐标系下的法线是 $n$，到第一个相机中心的距离是 $d$，第一个相机到第二个相机的坐标变换为 $R$、$T$。那么我们知道这个平面上的点从第一个相机的射影坐标到第二个相机的射影坐标可以由射影变换 $H=R+\frac{1}{d}Tn^T$ 得到。

考虑一个特殊平面 $z=0$ ，这个平面到第一个相机中心的距离是 0 。此时不存在从第一个相机到第二个相机的射影变换。

在这个平面上建立 X-Y 坐标系与世界坐标系的 X-Y 重合，这个平面上的（二维）坐标到第二个相机投影平面上的坐标存在一个射影变换：

$$
\begin{pmatrix}Q \\ 1\end{pmatrix} = \begin{pmatrix}
R & T \\
0 & 1
\end{pmatrix}
\begin{pmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 0 \\
0 & 0 & 1 
\end{pmatrix}
\begin{pmatrix}
x \\
y \\
1
\end{pmatrix}
$$

将 $R$ 按列记作 $(r_1, r_2, r_3)$，就可以得到：

$$
Q = H \begin{pmatrix}x \\ y \\ 1\end{pmatrix} = \begin{pmatrix}r_1 & r_2 & T\end{pmatrix}\begin{pmatrix}x \\ y \\ 1\end{pmatrix}
$$

也就是说，从这一平面上的二维坐标到相机 $R,T$ 上的射影坐标之间存在一个射影变换 $H = (r_1, r_2, T)$ 。
