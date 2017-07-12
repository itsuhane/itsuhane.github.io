---
layout: post
title: "深藏功与名"
date: 2017-01-06 07:24:54 GMT
tags:
- C++
- bug
comment: true
---

之前到隔壁去取一些数据。这是一些建筑模型的数据，不过很奇怪的是，模型的 Bounding Box 经常会大出去一截，导致我需要重新计算。

一开始觉得是我的读取方式有误，于是问他们 BB 的解析算法。顺藤摸瓜发现他们是这么计算每个包围盒的坐标的：

~~~ cpp
float bb_min[3], bb_max[3];
for(int i = 0; i < 3; ++i) {
  bb_min[i] = std::numeric_limits<float>::max();
  bb_max[i] = std::numeric_limits<float>::min(); // min 给出的是最小的绝对值
}
for(int j = 0; j < model.vertex_num(); ++j) {
  for(int i=0;i<3;++i) {
    bb_min[i] = std::min(bb_min[i], model.vertex(j)[i]);
    bb_max[i] = std::max(bb_max[i], model.vertex(j)[i]); 
  }
}
~~~

看到我加注释的那行忽然就明白这个错误的原因了。而他们也一下子解决了一个据说两年没发现原因的 bug 。所以说，遇到不熟悉的接口，一定要查文档。

于是开心地拿到了正确的数据离开了，深藏功与名……
