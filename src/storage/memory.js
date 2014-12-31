(function (cachejs) {

    var isCommonJS = typeof module == 'object' && typeof module.exports == 'object' && typeof require == 'function';


    var MemoryStorage = function () {
        this._hash = {};
    };

    MemoryStorage.prototype.set = function (key, value) {
        this._hash[key] = value;
    };

    MemoryStorage.prototype.del = function (key) {
        delete this._hash[key];
    };

    MemoryStorage.prototype.get = function (key) {
        return this._hash[key];
    };

    MemoryStorage.prototype.has = function (key) {
        return !!this._hash[key];
    };

    MemoryStorage.prototype.keys = function () {
        return Object.keys(this._hash);
    };

    cachejs.MemoryStorage = MemoryStorage;

    if (isCommonJS) {
        module.exports = MemoryStorage;
    }

})(typeof cachejs == 'object' && cachejs);
