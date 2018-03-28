---
title: OpenCV 中进行 YUV420 到 RGB 的转换
date: 2018-03-28 10:46:00 GMT
tags:
- OpenCV
comment: true
---

最近的一个项目中，需要从远程接收 H.264 编码的视频流，然后在本地进行解码后使用图像。

本地从 H.264 码流解码出的图像采用了 YCbCr(I420) 格式，对于一帧 $W\times H$ 的图像，它将像素色彩的三个分量分别储存在三个平面上，也就是三个缓冲区，首尾相连。第一个平面对应 Y 色度平面，储存了亮度信息，它的大小也是 $W\times H$。第二个和第三个平面对应 Cb 和 Cr 色度平面，储存了蓝色和红色的色差信息，由于利用了人眼视觉上对色彩的空间分布相对不敏感的特点，这两个色度平面对原始图像的两个方向上各进行了$\frac12$的降采样，也就是说每$2\times 2$的像素共用一组 $(C_b,C_r)$ 色差信息。由于这个原因，这两个平面的大小都是 $\frac W2 \times \frac H2$。

理论虽然是这样，实际要用 OpenCV 来做就比较麻烦了（并不）。

先说说麻烦在那里：由于三个色度平面大小不一，在如何使用 `cv::Mat` 表示上就产生了许多的猜测。网上一番搜索，基本都是介绍原理，实现需要一个像素一个像素手工转换。对于我这种懒人，我是非常希望可以用一句 `cv::cvtColor` 搞定的。这样做有很多的好处，比如代码更精简，比如工作量小，比如可以更快~~，比如有问题了可以甩锅给 OpenCV~~…… 可稍微看了一下文档就会意识到， **OpenCV 的文档根本就是垃圾，从文档是不可能知道该怎么用的！**

那么真的要自己去实现一个么？**不需要！** `cv::cvtColor` 究竟支不支持这样的转换呢？**支持！**

所以，怎么做呢？

有的时候，代码就是最好的文档（不过 OpenCV 又一次证明我错了）。经过浏览 OpenCV 中 `cv::cvtColor` 的代码实现，我注意到了这样的段落（项目中使用的是 OpenCV 2.4.13）：

```cpp
// :::
case CV_YUV2BGR_YV12: case CV_YUV2RGB_YV12: case CV_YUV2BGRA_YV12: case CV_YUV2RGBA_YV12:
case CV_YUV2BGR_IYUV: case CV_YUV2RGB_IYUV: case CV_YUV2BGRA_IYUV: case CV_YUV2RGBA_IYUV:
    {
        //http://www.fourcc.org/yuv.php#YV12 == yuv420p -> It comprises an NxM Y plane followed by (N/2)x(M/2) V and U planes.
        //http://www.fourcc.org/yuv.php#IYUV == I420 -> It comprises an NxN Y plane followed by (N/2)x(N/2) U and V planes
// :::
```

从这里可以看到 `CV_YUV2{BGR|RGB}[A]_{YV12|IYUV}` 系列枚举值对应了我们需要的色度转换。通过进一步阅读后面的处理（朋友，我替你读过了，所以不要读了，太浪费生命），可以知道正确的方法是建立一个 `cv::Mat` ，直接按照标准 YCbCr(I420) 的平面大小分配空间并填充数据，然后调用 `cv::cvtColor` 。整个过程的代码如下：

```cpp
cv::Mat YUV420_to_BGR888(
	int width, int height,
	const uchar * Y, const uchar * Cb, const uchar * Cr,
    int strideY, int strideCbCr
) {
	int uvwidth = width / 2;
	int uvheight = height / 2;
	int size = width * height;
	int uvsize = uvwidth * uvheight;
	
	// whole data size = Y + U + V = W*H + (W/2)*(H/2)*2 = W*(H+H/2)
	cv::Mat YCbCrData(cv::Size(width, height + uvheight), CV_8UC1);
	
	// get the pointer to the beginning of each plane.
	uchar* pY = YCbCrData.data;
	uchar* pCb = pY + size;
	uchar* pCr = pCb + uvsize;
	
	// copy Y channel for each line
	for (int i = 0; i < height; ++i) {
	    memcpy(pY + i*width, Y + i*strideY, width);
	}
	
	// copy Cb and Cr channel for each line
	for (int i = 0; i < uvheight; ++i) {
	    memcpy(pCb + i*uvwidth, Cb + i*strideCbCr, uvwidth);
	    memcpy(pCr + i*uvwidth, Cr + i*strideCbCr, uvwidth);
	}
	
	cv::Mat BGRData(cv::Size(width, height), CV_8UC3);
	
	cv::cvtColor(YCbCrData, BGRData, CV_YUV2BGR_IYUV);
	
	return BGRData;
}
```

在上面的代码里，我假定了 `width` 和 `height` 都是偶数，奇数的情形还请自行处理。此外，可以看到我这里对 YCbCr 和 YUV 不加区分的使用了，这两者根据场合还是存在不同的。fourcc 的网站上提供了比较详细的信息，可以参考 [YUV pixel formats](www.fourcc.org/yuv.php) 和 [YUV to RGB Conversion](http://www.fourcc.org/fccyvrgb.php) 。