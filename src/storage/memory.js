(function () {

    var isRegular = typeof window != 'undefined';
    var isCommonJS = typeof module == 'object' && typeof module.exports == 'object';


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

    if (isRegular) {
        window.CacheJS = window.CacheJS || {};
        window.CacheJS.MemoryStorage = MemoryStorage;
    } else if (isCommonJS) {
        module.exports.Storage = MemoryStorage;
    }

})();
