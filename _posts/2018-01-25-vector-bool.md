---
title: 在 vector 里使用 bool
date: 2018-01-25 05:39:00 GMT
tags:
- C++
comment: true
---

> Q: 我想在 `std::vector` 里使用 `bool` 可以么？  
> A: 当然是不可以！

> Q: 为什么不可以？  
> A: 其实也可以……

> Q: 一会儿可以一会儿不可以，别逗我行不行？  
> A: 你试试 `&v[0]` ……

> Q: 为啥别的类型都行，但 `std::vector<bool>` 就不让 `&v[0]` ？  
> A: 因为 `std::vector` 对 `bool` 进行了特化， 把若干 `bool` 压缩存储在了整数类型的每个二进制位上，因此无法取地址。

> Q: 好吧那怎么办……  
> A: 下面这段代码送给你，good luck and have fun！

```cpp
struct boolean {
    boolean() = default;
    boolean(bool value) : value(value) {}
    operator bool&() { return value; }
    operator const bool&() const { return value; }
    bool* operator&() { return &value; }
    const bool* operator&() const { return &value; }
private:
    bool value;
};
```
