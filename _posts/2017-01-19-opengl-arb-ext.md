---
layout: post
title: "OpenGL 扩展：ARB 还是 EXT"
date: 2017-01-19 09:01:08 GMT
tags:
- OpenGL
comment: true
---

OpenGL 有各种扩展，一些扩展 API 以 EXT 结尾，顾名思义就是 extension 的意思。另外有一些则是以 ARB 结尾，那么 ARB 是什么呢？

ARB 是 [Architecture Review Board](http://www.opengl.org/about/arb/) 的意思。在环顾了当前图形硬件的发展水平之后，如果某些扩展非常实用并且已经被广泛支持了，OpenGL 标准便会考虑在未来将这个扩展移入核心标准。中间作为一个过度，这个扩展便会带上 ARB 的记号（也就是钦点）。

基本上可以理解为 EXT -> ARB -> Core 的关系。
