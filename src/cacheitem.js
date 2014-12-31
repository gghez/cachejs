(function (cachejs) {

    var isCommonJS = typeof module == 'object' && typeof module.exports == 'object' && typeof require == 'function';

    var OptionsManager = isCommonJS ? require('optionjs') : window.OptionsManager;

    var CacheItem = function (key, storage, options) {
        this.key = key;
        this._storage = storage;
        this._options = new OptionsManager(options);
        this.storedAt = undefined;
    };

    CacheItem.prototype.options = function (optKey, optValue) {
        if (optValue === undefined) {
            return this._options.get(optKey);
        } else {
            this._options.set(optKey, optValue);
        }
    };

    CacheItem.prototype.isExpired = function () {
        return this.storedAt.getTime() + this._options.get('lifetime') < new Date().getTime();
    };

    CacheItem.prototype.value = function () {
        if (arguments.length === 0) {
            var item = this._storage.get(this.key);
            return item && item.value;
        } else {
            var value = arguments[0];

            var oldItem = this._storage.get(this.key);
            var oldValue = oldItem && oldItem.value;

            this._storage.set(this.key, {
                item: this,
                value: value
            });

            this.storedAt = new Date();

            if (this._options.get('onUpdate')) {
                this._options.get('onUpdate')(this.key, value, oldValue);
            }
        }
    };

    cachejs.CacheItem = CacheItem;

    if (isCommonJS) {
        module.exports = CacheItem;
    }

})(typeof cachejs == 'object' && cachejs);
