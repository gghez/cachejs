(function () {

    var isRegular = typeof window != 'undefined';
    var isCommonJS = typeof module == 'object' && typeof module.exports == 'object';

    function createOptionsManager(options, defaults) {
        if (isRegular) {
            return new window.OptionsManager(options, defaults);
        } else if (isCommonJS) {
            return require('optionjs')(options, defaults);
        }
    }

    function getMemoryStorage() {
        if (isRegular) {
            return new window.CacheJS.MemoryStorage();
        } else if (isCommonJS) {
            var memoryStorage = require(__dirname + '/storage/memory');
            return new memoryStorage.Storage();
        }
    }

    var Container = function (options) {
        var _this = this;

        _this._options = createOptionsManager(options, {
            lifetime: false,
            onUpdate: function () {
            },
            onExpiry: function () {
            },
            storage: 'memory',
            pruningInterval: 60000
        });

        _this._options.onChange('storage', function (n) {
            var storage = _this._resolveStorage(n);

            // Copy values from old storage to new one
            if (_this._storage) {
                _this._storage.keys().forEach(function (key) {
                    storage.set(key, _this._storage.get(key));
                });
            }
            _this._storage = storage;
        });

        _this._storage = _this._resolveStorage(_this._options.get('storage'));

        _this._items = {};

        _this._pruningTimer = setTimeout(function () {
            _this._onPruning();
        }, _this._options.get('pruningInterval'));
    };

    Container.prototype._onPruning = function () {
        var _this = this;

        Object.keys(this._items)
            .map(function (key) {
                return _this._items[key];
            })
            .filter(function (item) {
                return item.isExpired();
            })
            .forEach(function (item) {
                item.setValue();
                item.onExpiry(item);
            });
    };

    Container.prototype._resolveStorage = function (storage) {
        if (storage == 'memory') {
            return getMemoryStorage();
        }
    };

    Container.prototype._createItem = function (key) {
        return {
            _storage: this._storage,
            key: key,
            getValue: function () {
                return this._storage.get(key);
            },
            setValue: function (value) {
                var oldValue = _this._storage.get(key);
                this._storage.set(key, value);
                this.storedAt = new Date();
                this.onUpdate(key, value, oldValue);
            },
            isExpired: function () {
                return this.storedAt.getTime() + this.lifetime < new Date().getTime();
            }
        };
    };

    Container.prototype.options = function (optKey, optValue) {
        if (optValue === undefined) {
            return this._options.get(optKey);
        } else {
            this._options.set(optKey, optValue);
        }
    };

    Container.prototype.prune = function () {
        clearTimeout(this._pruningTimer);
        this._onPruning();
        this._pruningTimer = setTimeout(this._onPruning.bind(this), this._options.get('pruningInterval'));
    };

    Container.prototype.set = function (key, value, options) {
        var cacheItem = this._items[key] || this._createItem(key);

        // Update cache item options
        cacheItem.lifetime = options.lifetime || this._options.get('lifetime') || cacheItem.lifetime;
        cacheItem.onExpiry = options.onExpiry || this._options.get('onExpiry') || cacheItem.onExpiry;
        cacheItem.onUpdate = options.onUpdate || this._options.get('onUpdate') || cacheItem.onUpdate;

        cacheItem.setValue(value);

        return cacheItem;
    };

    Container.prototype.get = function (key) {
        var cacheItem = this._items[key];

        if (cacheItem && !cacheItem.isExpired()) {
            return cacheItem.getValue();
        }
    };

    Container.prototype.getItem = function (key) {
        return this._items[key];
    };

    Container.prototype.has = function (key) {
        return this._items[key] && !this._items[key].isExpired();
    };


    if (isRegular) {
        window.CacheJS = window.CacheJS || {};
        window.CacheJS.Container = Container;
    } else if (isCommonJS) {
        module.exports.Container = Container;
    }

})();
