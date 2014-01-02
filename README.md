ObjectPool
=====

object pooling


```
function Vec() {
	this.x = 0;
	this.y = 0;
}

var VecPool = new ObjectPool(Vec), // creare new ObjectPool with constructor
	vec = VecPool.create();


vec.x = 10;
vec.y = 25;

// removes object and pool it
VecPool.removeObject(vec);

// removes all objects in arguments and pools them
VecPool.remove(vec, vec1, vec2);

// removes all objects and pools them
VecPool.clear();

```