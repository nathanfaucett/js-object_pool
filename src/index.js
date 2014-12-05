function ObjectPool(constructor) {

    this.pooled = [];
    this.objects = [];
    this.constructor = constructor;
}

ObjectPool.prototype.create = function() {
    var pooled = this.pooled,
        objects = this.objects,
        object = pooled.length !== 0 ? pooled.pop() : new this.constructor();

    objects[objects.length] = object;
    return object;
};

ObjectPool.prototype.removeObject = function(object) {
    var objects = this.objects,
        pooled = this.pooled,
        index = objects.indexOf(object);

    if (index > -1) {
        pooled[pooled.length] = object;
        objects.splice(index, 1);
    }

    return this;
};

ObjectPool.prototype.remove = ObjectPool.prototype.removeObjects = function() {
    var i = arguments.length;

    while (i--) this.removeObject(arguments[i]);
    return this;
};

ObjectPool.prototype.clear = function() {
    var objects = this.objects,
        pooled = this.pooled,
        i = objects.length;

    while (i--) pooled[pooled.length] = objects[i];
    objects.length = 0;

    return this;
};

ObjectPool.prototype.clearForEach = function(fn) {
    var objects = this.objects,
        pooled = this.pooled,
        object,
        i = objects.length;

    while (i--) {
        object = objects[i];

        pooled[pooled.length] = object;
        fn(object);
    }
    objects.length = 0;

    return this;
};

ObjectPool.prototype.empty = function() {

    this.pooled.length = this.objects.length = 0;
    return this;
};


module.exports = ObjectPool;
