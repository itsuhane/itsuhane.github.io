---
layout: post
title: ORB 特征提取计时
date: 2016-12-08 09:01:05 GMT
tags:
- computer vision
---

在我的计算机上对 OpenCV 的 ORB 特征提取速度进行了测试。我首先对测试用数据集的所有图像进行 FAST 特征检测，然后对检测出的特征点进行 ORB 特征提取，测量仅包含了特征提取的时间。结果如下图：

{% include span_image url="/2016-12-08-orb-timing-1.png"%}

$T(x) = ax+b$ 是对 ORB 时间开销与特征数目关系的线性拟合。
$a=1.55\times10^{-3} \mathrm{ms}$ ， $b = 1.67 \mathrm{ms}$ 。

测试环境是 Intel i5-2320 3.00GHz, 8.0GB DDR3, Win 10 x64, VS 2015 U4, OpenCV 3.1.0

同样的测试对 FAST 特征检测就没什么意义了，FAST 检测需要对图像像素进行扫描，因此对图像大小更加敏感。结果的数量对 FAST 的影响比较小（见下图）。

{% include span_image url="/2016-12-08-orb-timing-2.png"%}

$a = 3.56\times10^{-4} \mathrm{ms}$ ，$b = 0.527 \mathrm{ms}$ 。

从图上可以看出 FAST 检测的时间消耗基本在 5.5 ms 以内。我采用的测试图像大小均为 960x540 。
后面还需要进一步研究 ORB-SLAM 中采用的四叉树特征检测方式对 FAST 特征检测的速度影响。
