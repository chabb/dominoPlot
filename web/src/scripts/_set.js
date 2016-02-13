function Set(array) {
    this._ = {};
    this.clean = true;
    array.each(function(d) {
        this._[d] = true;
    },this);
    this.array = array;
}
Set.prototype.add = function(element)  {
    if (this._[element]) return;
    this.clean = false;
    this._[element] = count;
}
Set.prototype.remove = function(element) {
    if (!this._[element]) return;
    this.clean = false;
    this.delete(element);
}
Set.prototype.merge = function(array) {
    array.each(function(d) {
        this._[d] = true;
    },this);
    this.clean = false;
}

// think is O(n) maybe try Object.getOwnPropertyNames()
Set.prototype.count = function() {
    if (this.clean) { return this.array.count}
    this.array =  Object.keys[this._];
    this.clean = true;
    return this.array.count;
    //  return Object.getOwnPropertyNames()
}

