---
---

## CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.0.0)
project(ProjectName VERSION 0.1.0 LANGUAGES CXX)

# global settings
# find_package
# ...

add_library(LibraryName
    # add source file of library
    # don't put header files here
    src/LibrarySource.cpp
)

target_compile_features(
    LibraryName
    PUBLIC
        # features required for using LibraryName
        # will propagate to users
        cxx_std_14
    PRIVATE
        # features used when compiling LibraryName
        # will not propagate to users
)

target_include_directories(
    LibraryName
    PUBLIC
        # include path when using
        # will propagate
        $<INSTALL_INTERFACE:${CMAKE_INSTALL_PREFIX}/include>
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    PRIVATE
        # include path when compiling
        # won't propagate
        ${CMAKE_CURRENT_SOURCE_DIR}/src
)

target_link_libraries(
    LibraryName
    PUBLIC
        # ...
    PRIVATE
        # ...
)

add_executable(
    ExecutableName
    src/ExecutableSource.cpp
    # ...
)

target_link_libraries(
    ExecutableName
    PRIVATE
        LibraryName
        # by linking LibraryName like this,
        # it will inherit all include dir/features/etc.
        # no need to set them again.
)
```

### 作为子目录的用法

```cmake
# ...

add_subdirectory(LibraryDirectory)

# ...

target_link_libraries(
    TargetName
    PRIVATE
        LibraryName
)
```

### 作为独立编译安装的库的用法

（待续）
