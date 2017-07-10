---
layout: post
title: RANSAC和一个有趣的bug
date: 2016-11-30 09:00:02
tag:
- RANSAC
- bug
comments: true
---

故事背景是这样的：我想要实现 RANSAC 算法进行模型拟合。RANSAC 通过重复随机在数据中抽取样本进行拟合，选择最优解的方式，来从包含有外点 (outlier) 的数据集中得到正确的拟合结果。为了满足拟合的成功概率 $P$ ，需要根据拟合模型需要抽取的最小样本数 $k$ 和数据集包含的内点比例 $r$ 来选择合适的重复抽样次数 $N$ 。它们之间的关系需要满足
$$
1-(1-r^k)^N > P.
$$

真实中，由于内点比例 $r$ 未知，可以先设置初始的初始的内点比例 $r$ 为保守估计的比例下界 。在后面的迭代中，每当获得了一致性更好的模型，这个模型的内点量 $r_{\text{new}}$ 决定了数据集中内点比例新的下界。因此更新 $r\gets r_{\text{new}}$ 并重新计算 $N$ ，以此不断缩小需要的迭代数上界估计。这一策略在 [1, p120] 中进行了介绍。

背景故事讲完了，关于 RANSAC 具体的理论可以参考相关的文献。为了计算上面提到的 $N$ ，首先想到实现下面的代码：

```
size_t iteration_limit(double r, double P, size_t k) {
    double n = log(1-P) / log(1-pow(r, k));
    return (size_t)ceil(n);
}
```

然而这样朴素的实现是会导致数值溢出的问题的，具体表现在两个方面：运算结果超过 `size_t` 类型的上界和浮点数运算产生 +Inf/NaN 。

一个一举两得的解决办法是使用下面的代码：

```
size_t iteration_limit(double r, double P, size_t k) {
   double n = log(1-P) / log(1-pow(r, k));
   return (size_t)ceil(std::min(1.0e10, n));
}
```

这里我们选择了一个很大但依然在 `size_t` 范围内的阈值。`std::min(a, b)` 会使用 `operator<` 返回两者中的较小值，并在两者相等时返回前者。根据 `std::min` 的语义，当 `n` 超过阈值，甚至为 +Inf 时，它可以保证结果为我们的阈值。而在 `n` 为 NaN 时，由于 `operator<` 总是 `false` ，它被“当做”相等，依旧返回前者，也就是阈值。这样就可以过滤掉所有不希望出现的结果了。

这美妙的想法在 Visual Studio 2015 Update 1 x64 Release 的默认编译配置下却失败了 （根据尝试，其它版本、体系、调试模式下都无关，就是这么巧） ……我的 RANSAC 在运行中经常会花费异常多的时间。跟踪发现它的迭代次数偶尔会“爆表”成奇怪的数字，进一步检查发现 `std::min` 的行为存在问题，在 NaN 时会反其道行之给出比较中的后者作为结果。

解决方法么……也很简单，用 `((b)<(a))?(b):(a)` 替代 `std::min(a, b)` 。是的你没看错，前者正是后者的实现……

当然，VS2015 已经 Update 4 啦……还不赶紧升级（隔壁编译器们表示不屑

[1] Multiple View Geometry in Computer Vision, second edition. Hartley, R. I. and Zisserman, A., Cambridge University Press, 2014.
