(function (cachejs) {

    var isCommonJS = typeof module == 'object' && typeof module.exports == 'object' && typeof require == 'function';

    var OptionsManager = isCommonJS ? require('optionjs') : window.OptionsManager;
    var CacheItem = isCommonJS ? require('./cacheitem') : cachejs.CacheItem;
    var MemoryStorage = isCommonJS ? require('./storage/memory') : cachejs.MemoryStorage;
    var FileStorage = isCommonJS ? require('./storage/file') : cachejs.FileStorage;

    var Container = function (options) {
        var _this = this;

        _this._options = new OptionsManager(options, {
            lifetime: false,
            onUpdate: function () {
            },
            onExpiry: function () {
            },
            storage: 'memory',
            pruningInterval: 5000
        });

        _this._storage = _this._resolveStorage(_this._options.get('storage'));
        _this._options.onChange('storage', function (n) {
            var storage = _this._resolveStorage(n);

            // Copy values from old storage to new one
            _this._storage.keys().forEach(function (key) {
                storage.set(key, _this._storage.get(key));
            });

            _this._storage = storage;
        });

        _this._reloadCache();
        _this._onPruning();
    };

    Container.prototype._resolveStorage = function (storage) {
        if (storage == 'memory') {
            return new MemoryStorage();
        } else if (storage == 'file'){
            return new FileStorage();
        } else if (typeof storage == 'function' || typeof storage == 'object') {
            return storage;
        } else {
            throw new Error('Invalid storage.');
        }
    };

    Container.prototype._reloadCache = function () {
        var _this = this;

        _this._items = {};
        if (_this._storage) {
            _this._storage.keys().forEach(function (key) {
                _this._items[key] = _this._storage.get(key).item;
            });
        }
    };

    Container.prototype._onPruning = function () {
        var _this = this;

        clearTimeout(_this._pruningTimer);

        _this.prune();

        _this._pruningTimer = setTimeout(function () {
            _this._onPruning();
        }, _this._options.get('pruningInterval'));
    };

    Container.prototype.options = function (optKey, optValue) {
        if (optValue === undefined) {
            return this._options.get(optKey);
        } else {
            this._options.set(optKey, optValue);
        }
    };

    Container.prototype.prune = function () {
        var _this = this;

        Object.keys(_this._items)
            .map(function (key) {
                return _this._items[key];
            })
            .filter(function (item) {
                return item.isExpired();
            })
            .forEach(function (item) {
                delete _this._items[item.key];
                item._storage.del(item.key);
                if (item.options('onExpiry')) {
                    item.options('onExpiry')(item);
                }
            });
    };

    Container.prototype.set = function (key, value, options) {
        var _this = this;

        var cacheItem = (function () {
            var item = _this._items[key];
            if (item) {
                item.lifetime = (options && options.lifetime) || item.lifetime;
                item.onExpiry = (options && options.onExpiry) || item.onExpiry;
                item.onUpdate = (options && options.onUpdate) || item.onUpdate;
            } else {
                item = new CacheItem(key, _this._storage, new OptionsManager(options, {
                    onUpdate: _this._options.get('onUpdate'),
                    onExpiry: _this._options.get('onExpiry'),
                    lifetime: _this._options.get('lifetime')
                }).options);
                _this._items[key] = item;
            }

            return item;
        })();

        cacheItem.value(value);

        return cacheItem;
    };

    Container.prototype.get = function (key) {
        var item = this._items[key];

        if (item && !item.isExpired()) {
            return item.value();
        }
    };

    Container.prototype.getItem = function (key) {
        return this._items[key];
    };

    Container.prototype.has = function (key) {
        return !!this._items[key] && !this._items[key].isExpired();
    };

    cachejs.Container = Container;

    if (isCommonJS) {
        module.exports = Container;
    }

})(typeof cachejs == 'object' && cachejs);
