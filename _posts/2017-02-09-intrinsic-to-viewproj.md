---
layout: post
title: "从内参矩阵到 OpenGL 投影矩阵的转换"
date: 2017-02-09 09:01:01 GMT
tags:
- OpenGL
comment: true
---

做立体视觉时经常要将结果绘制出来，这时可能会面临这样一个问题：相机的内参如何转换为 OpenGL 中的投影矩阵？

在 [http://www.songho.ca/opengl/gl_projectionmatrix.html](http://www.songho.ca/opengl/gl_projectionmatrix.html) 有一个非常好的 OpenGL 投影矩阵的介绍，不过如果跟随这个介绍来尝试转换内参则显得有些繁琐。这里介绍一种相对简单直接的方法。

我们知道：对于三维空间中的点 $(x,y,z)$ ，内参矩阵 $K$ 可以将它投影到图像像素坐标系下的一个齐次坐标。我们把它记在这里：

$$
\begin{pmatrix}
x' \\ y' \\ z
\end{pmatrix}
=
\begin{pmatrix}
f_x & 0 & c_x \\
0 & f_y & c_y \\
0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
x \\ y \\ z
\end{pmatrix}
$$

而投影后的像素坐标对应于 $(x_p, y_p) = (x’/z, y’/z)$

OpenGL 中，屏幕空间采用的是一个标准化设备坐标系（NDC），详情参考上面的介绍。这个坐标系并不是像素坐标系，因此我们需要进行适当的转换。

对于横纵坐标，这个转换非常的直接，假设视口的（像素）大小为 $w\times h$，那么我们就有 $x_{ndc} = 2x_p/w-1$，$y_{ndc}=2y_p/h-1$ 。将这一关系在齐次坐标下表达，就可以得到：

$$
\begin{pmatrix}
zx_{ndc} \\
zy_{ndc} \\
z
\end{pmatrix} = 
\begin{pmatrix}
\frac2w & 0 & -1 \\
0 & \frac2h & -1 \\
0 & 0 & 1
\end{pmatrix}\begin{pmatrix} x’ \\ y’ \\ z \end{pmatrix} =
\begin{pmatrix}
\frac{2f_x}w & 0 & \frac{2c_x-w}w \\
0 & \frac{2f_y}h & \frac{2c_y-h}h \\
0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
x \\
y \\
z
\end{pmatrix}
$$

在 OpenGL 里，所有的坐标都是三维齐次坐标，绘制时前三个分量会除以第四个分量。将上面的关系对应到三维齐次坐标下的变换矩阵，就对应有：

$$
\begin{pmatrix}
zx_{ndc} \\
zy_{ndc} \\
\cdot \\
z
\end{pmatrix} =
\begin{pmatrix}
\frac{2f_x}w & 0 & \frac{2c_x-w}w & 0 \\
0 & \frac{2f_y}h & \frac{2c_y-h}h & 0 \\
\cdot & \cdot & \cdot & \cdot \\
0 & 0 & 1 & 0
\end{pmatrix}
\begin{pmatrix}
x \\ y \\ z \\ 1
\end{pmatrix}
$$

注意到，这里空出了一行，这一行对应了 $z_{ndc}$ 。而它的处理与前两个分量有些不同……

------

在 OpenGL 的 NDC 坐标系下，深度范围是 [-1, 1] 。其中 -1 对应了一个最近的深度 $n$，1 对应了一个最远的深度 $f$，这两个深度边界都需要人工指定。

那么假如这两个边界给定了，我们只要线性地将 $z$ 映射到 [-1, 1] 不就好了吗？错！我们来看看为什么不能这么做：

我们在齐次坐标系下进行线性的映射，那么就有 $zz_{ndc} = Az+B$ 。将两边同时除掉 $z$ 就会得到 $z_{ndc} = A + B\frac1z$ 。这表明 $z_{ndc}$ 是关于 $\frac1z$ 线性的，而不是关于 $z$ 线性。将上面的两个边界条件代入求解 $A$ 和 $B$ ，可以得到：

$$
z_{ndc} = \frac{f+n}{f-n}-\frac{2fn}{f-n}\frac1z
$$
或者
$$
zz_{ndc} = \frac{f+n}{f-n}z-\frac{2fn}{f-n} 
$$

所以，完整的 OpenGL 投影关系是
$$
\begin{pmatrix}
zx_{ndc} \\
zy_{ndc} \\
zz_{ndc} \\
z
\end{pmatrix} =
\begin{pmatrix}
\frac{2f_x}w & 0 & \frac{2c_x-w}w & 0 \\
0 & \frac{2f_y}h & \frac{2c_y-h}h & 0 \\
0 & 0 & \frac{f+n}{f-n} & -\frac{2fn}{f-n} \\
0 & 0 & 1 & 0
\end{pmatrix}
\begin{pmatrix}
x \\ y \\ z \\ 1
\end{pmatrix}
$$

------

由于深度上存在这样一个倒数的线性关系，如果最远深度过大，在最远深度附近，$\frac1z$ 的变化可能会非常小。这时如果深度精度不足，这种小变化可能由于舍入误差而产生错误，导致错误的深度结果。这种现象被叫做 z-fighting 。在上面的链接中有更详细的分析。

注意会发生这种现象是因为我们采用了线性的齐次坐标变换，在这种变换下，深度的映射必然包含了倒数关系。在传统的静态 OpenGL 管线中，我们只有设置投影矩阵来进行三维点向视口的投影，因此无法避免这种可能产生 z-fighting 的行为。但现在多采用可编程管线了，因此可以采用下面的方式进行投影，使得深度关系是线性的：

``` cpp
uniform mat3 K; // intrinsic
uniform vec2 S; // viewport size
uniform float n; // near
uniform float f; // far
varying vec3 vertex; // vertex coordinate
void main() {
    vec3 p = K*vertex;
    vec3 result;
    result.xy = 2*(p.xy/p.z/S) - 1;
    result.z = 2*(p.z-n)/(f-n) - 1; // linearly map depth
    gl_Position = vec4(result, 1);
}
```

注意的是上面只是演示一下思路，代码还有优化的空间。

------

细心的话，可能会注意到一个隐藏的小细节：上面我们得到的线性变换矩阵的行列式是大于零的，这意味着如果我们原始的坐标处于一个右手系，那么变换后的坐标也应该是一个右手系坐标。然而 OpenGL 的 NDC 采用的是一个左手系，这样我们变换后的坐标套用在这个坐标系下就会发生一个镜像变换。所以我们应该在变换矩阵中考虑这个镜像的因素，保证变换后的 NDC 坐标不会发生镜像。

我们来看一看这个镜像出现在什么地方：对于像素坐标，我们一般采用左上角为原点，向右下为 XY 正方向的朝向，如果我们建立相机局部坐标系时也采用同样的 XY 朝向建立右手系，可以得到 X 向右，Y 向下，Z 向前。而在 NDC 中，Y 是朝上的，这一差异带来了镜像问题。因此我们需要将变换矩阵中 Y 对应的行翻转一下（取负）。

不过如果是做离屏绘制，并且在绘制后将像素缓冲区/纹理缓冲区的内容读取到外部，这个镜像又无需考虑了。这是由于 OpenGL 缓冲区中，像素是逐行自下向上表示的，而外部的像素缓冲通常是自上向下表示的。因此如果将完整的缓冲读取出来，并直接套用外部的表示，图像内容将发生上下翻转。这一巧合刚好弥补了前面提到的 NDC 坐标系手向差异带来的镜像问题。因此读取出的图像又不存在翻转了。

补充：注意，因为存在提到的镜像问题，在绘制时，面的朝向会发生反转。如果原先采用 `GL_CCW` （默认如此）为正向，现在应当改为 `GL_CW` 。
