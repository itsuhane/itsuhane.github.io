---
layout: post
title: "OpenGL 的 Texture 和 RenderBuffer"
date: 2017-01-23 09:00:54 GMT
tags:
- OpenGL
comment: true
---

在 OpenGL 中使用 Framebuffer 进行绘制时，需要为它指定绘制到的目标。可以用的目标有两类，分别是 Texture 和 RenderBuffer 。为什么会有这两种目标来做同样的事情呢？ 只有经过细心地比较才会发现：OpenGL 中的 Texture 只支持色彩和深度缓冲区格式，并不支持如 Stencil 等辅助的缓冲区格式。RenderBuffer 则支持了所有的缓冲区格式。 此外，在建立两种对象的时候，需要为它们指定数据类型。对于 Texture ，需要指明数据的内部逻辑类型和一个具体的存储格式（比如24位深度 `GL_DEPTH_COMPONENT24`）；对于 RenderBuffer 只需要指定内部的逻辑类型就可以了（比如同样储存深度，只需要用 `GL_DEPTH_COMPONENT`）。这说明 RenderBuffer 是一种更偏向图形硬件内部表达的对象。 在使用上，两者除了对应的 API 有细微的区别，其他方面基本可以相互替代，但 Texture 可以作为绘制目标允许我们进行 Render to Texture 。

后记：后来发现，根据内部类型/用途的不同，RenderBuffer 也可以指定具体的存储格式。
