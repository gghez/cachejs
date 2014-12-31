var cachejs = (function () {

    var isCommonJS = typeof module == 'object' && typeof module.exports == 'object' && typeof require == 'function';


    var cachejs = {};

    if (isCommonJS) {
        cachejs = module.exports = {};

        cachejs.MemoryStorage = require('./storage/memory');
        cachejs.CacheItem = require('./cacheitem');
        cachejs.Container = require('./container');
    }

    return cachejs;

})();
