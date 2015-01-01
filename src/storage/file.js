(function (cachejs) {

    var isCommonJS = typeof module == 'object' && typeof module.exports == 'object' && typeof require == 'function';

    var FileStorage = function () {
        var isWin = /^win/.test(process.platform);

        this.fs = require('fs');
        if (isWin) {
            this.storePath = 'c:\\temp\\cachejs\\';

        } else {
            this.storePath = '/tmp/cachejs/';
        }

        if (!this.fs.existsSync(this.storePath)) {
            this.fs.mkdirSync(this.storePath);
        }
    };

    FileStorage.prototype._md5 = function (key) {
        var crypto = require('crypto');
        var hash = crypto.createHash('md5').update(key).digest('hex');

        return hash;
    };

    FileStorage.prototype.set = function (key, value) {
        this.fs.writeFileSync(this.storePath + this._md5(key), JSON.stringify(value), {encoding: 'utf8'});
    };

    FileStorage.prototype.del = function (key) {
        if (this.has(key)) {
            this.fs.unlinkSync(this.storePath + this._md5(key));
        }
    };

    FileStorage.prototype.get = function (key) {
        if (this.has(key)) {
            var filename = this.storePath + this._md5(key);
            var valueJSON = this.fs.readFileSync(filename, {encoding: 'utf8'});

            return JSON.parse(valueJSON);
        }
    };

    FileStorage.prototype.has = function (key) {
        return this.fs.existsSync(this.storePath + this._md5(key));
    };

    FileStorage.prototype.keys = function () {
        return [];
    };

    cachejs.FileStorage = {};

    if (isCommonJS) {
        module.exports = FileStorage;
    }

})(typeof cachejs == 'object' && cachejs);