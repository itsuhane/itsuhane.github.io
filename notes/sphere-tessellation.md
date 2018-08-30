---
layout: docs-page
---

Euler says:
$$
v-e+f = 2
$$
If one tries to tessellate the sphere surface with solely hexagon. Let $x$ be the number of hexagon, then:
$$
\begin{align}
v &= 6x/3 \\
e &= 6x/2 \\
f &= x \\
v - e + f &= 2x-3x+x = 2
\end{align}
$$
This leads to contradiction.

To make tessellation possible, we have to add $y$ pentagons, so that:
$$
\begin{align}
v &= (6x+5y)/3 \\
e &= (6x+5y)/2 \\
f & = x+y \\
v-e+f &= y/6 = 2
\end{align}
$$
So we can solve and get $y = 12$.

So a sphere surface can be tesellated with 12 pentagons plus (many) hexagons.

See also: https://github.com/vraid/earthgen-old

