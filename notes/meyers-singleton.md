---
layout: docs-page
---

Singleton is a commonly used pattern in C++. Typically, it is implemented with a managed static variable.

```cpp
static Singleton instance;
```

Users are forbid from creating new instances, this is done through hiding the constructor.

```cpp
class Singleton {
    static Singleton *s_instance = nullptr;
    Singleton() {
        // :::
    }
private:
    static Singleton &instance() {
        if(!s_instance) {
            s_instance = new Singleton;
        }
        return *s_instance;
    }
};
```

If we neglect the fact that `m_instance` never got deleted. Above example works fine for most of the cases. Resource being not freed is usually a leak, but in singleton's case, we typically want it to live until the program terminates. Operating system will carry on the clean up process for us. This pattern is called **Trusty Leaky Singleton**.

There is, however, a caveat. The initialization is not thread-safe. When multiple threads trying to obtain the instance, but the only instance has not been created. Multiple `new`-s could occur, creating more leaks.

If fix the leaking is our only aim, we could directly use a static instance, instead of holding the pointer. But there are still two problems: 1. We loose the flexibility to delay the creation (so we cannot initialize the singleton with parameters at runtime), and 2. The constructor may still be called more than once, this is rare but can still create serious problem.

Since C++ 11, the standard requires compiler to take any measure to make sure that variables declared at block scope with the specifier `static` have static storage duration but are initialized the first time control passes through their declaration. To put simply: **a static variable in function scope will never be initialized twice**.

By taking advantage of this strong gaurantee. We can have following code:

```cpp
class Singleton {
public:
    static Singleton &instance() {
        static Singleton s_instance; // create exactly once.
        return s_instance;
    }
};
```

This easy and correct pattern is named **Meyers' Singleton** and was coind in More Effective C++ by S. Meyers. By moving the static instance into function scope, we never have to worry the multiple initialization problem. The initialization happens when the function is invoked first, allow us to prepare initialization parameters at runtime. The same pattern can also be used to create simple `call_once` utility.