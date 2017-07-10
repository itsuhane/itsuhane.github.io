---
layout: post
title: 连续白噪音和布朗噪音的离散模拟
date: 2016-12-03 09:00:00
tag:
- stochastic process
- random noise
- simulation
comment: true
---

为了生成模拟实验数据，需要用到白噪音和布朗噪音。连续白噪音 $u(t)$ 通常定义为满足如下条件的随机信号：

$$
\begin{aligned}
E[u(t)] &= 0 \\\
E[u(t)u(t+\tau)] &= \sigma_u^2\delta(\tau).
\end{aligned}
$$

即任意时刻的信号的期望为 0 ，方差为 $\sigma_u^2\delta(\tau)$ ，且不同时刻信号互相独立。$\delta$ 是 Dirac 函数，即单位冲击响应。

设 $u_i = u(t_0+i\Delta t) = u(t_i)$ 为离散化后的信号，那么 $u_i$ 对应于 $\Delta t$ 时间窗内 $u(t)$ 的均值，有

$$
\begin{aligned}
u_i &= \frac{1}{\Delta t}\int_0^{\Delta t} u(t_{i-1}+\tau) d\tau \\\
E[u_i^2] &= \frac{1}{\Delta t^2}\int_0^{\Delta t} \int_0^{\Delta t} \sigma_u^2 \delta(\tau-\upsilon) d\tau d\upsilon = \frac{\sigma_u^2}{\Delta t}.
\end{aligned}
$$

因此，在用离散序列模拟时，应使用均值为 0 ，方差为 $\sigma_u^2/\Delta t$ 的高斯随机数产生采样。

布朗噪音 $v(t)$ 可以定义为白噪音的积分：

$$
\begin{aligned}
v(0) &= v_0 \\\
v’(t) &= u(t).
\end{aligned}
$$

以类似方式离散化后可知 $\Delta v_i = v_i - v_{i-1} = \int_0^{\Delta t}u(t_{i-1}+\tau)d\tau$ 。于是 $E[ \Delta v_i^2 ] = \sigma_u^2\Delta t$ 。

所以离散化后的差分方程为 $v_i = v_{i-1} + \Delta v_i$ ，其中 $ \Delta v_i \sim N(0, \sigma_u^2 \Delta t)$  。
