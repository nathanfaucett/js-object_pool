

function ObjectPool(constructor) {

	this.pooled = [];
	this.objects = [];
	this.object = constructor;
}


ObjectPool.prototype.create = function() {
	var pooled = this.pooled,
		object = pooled.length ? pooled.pop() : new this.object;

	this.objects.push(object);
	return object;
};


ObjectPool.prototype.removeObject = function(object) {
	var objects = this.objects,
		pooled = this.pooled,
		index = objects.indexOf(object);

	if (index > -1) {
		pooled.push(object);
		objects.splice(index, 1);
	}

	return this;
};


ObjectPool.prototype.remove = ObjectPool.prototype.removeObjects = function() {

	for (var i = arguments.length; i--;) this.removeObject(arguments[i]);
	return this;
};


ObjectPool.prototype.clear = function() {
	var objects = this.objects,
		pooled = this.pooled,
		i;

	for (i = objects.length; i--;) pooled.push(objects[i]);
	objects.length = 0;

	return this;
};


module.exports = ObjectPool;