---
layout: post
title: 记一个低级错误
date: 2016-12-01 09:00:00
tag:
- C++
- OOP
- Virtual Function
- Destructor
- bug
comment: true
---

相当一段时间里我都没有使用过 C++ OOP 的那一部分特性了。最近，在写的一个程序里出现了内存泄漏，一度百思不得其解：我没有使用需要人为释放的资源呀？ 后来发现是用了一个继承类，但基类的析构函数忘记了虚化……