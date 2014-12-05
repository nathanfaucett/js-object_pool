global.ObjectPool = require("../src/index");


function Person() {
    this.name = null;
    this.sex = null;
}

Person.prototype.init = function(name, sex) {
    this.name = name;
    this.sex = sex;
};

function Male() {
    Person.call(this);
}

Male.prototype.init = function(name) {
    Person.prototype.init.call(this, name, "male");
};

global.malePool = new ObjectPool(Male);

global.male = malePool.create();
male.init("Nathan");
