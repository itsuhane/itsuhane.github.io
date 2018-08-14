---
layout: docs-page
---

## Eigen

```bash
#!/bin/bash
git submodule add https://github.com/eigenteam/eigen-git-mirror.git eigen
pushd eigen && git checkout <version> && popd
```

```cmake
# CMakeLists.txt
set(Eigen3_DIR eigen)
find_package(Eigen3 <version> REQUIRED NO_MODULE)
```
