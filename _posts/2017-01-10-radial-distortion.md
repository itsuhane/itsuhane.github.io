---
layout: post
title: "径向畸变的效果"
date: 2017-01-10 09:00:53 GMT
tags:
- computer vision
banner: /2017-01-10-radial-distortion.gif
---

Effect of Radial Distortion

Explanation: Black dots should form a rectangular grid. However, if the camera lens has radial distortion, image will be distorted. This animation simulates the photo under different radial distortion parameters. More specifically, the distorted image point is given by $p \mapsto L(r)\times p$, where $L(r) = 1+k_1\times r$, and $r = \\|p-c\\|$.
