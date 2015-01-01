describe('File Storage', function () {

    var sinon, assert, FileStorage;

    if (typeof module == 'object' && typeof require == 'function') {
        sinon = require('sinon');
        assert = require('chai').assert;
        FileStorage = require('../src/storage/file');
    } else {
        sinon = window.sinon;
        assert = window.chai.assert;
        FileStorage = window.cachejs.FileStorage;
    }

    it('Initialize in context.', function () {
        var storage = new FileStorage();
    });


    it('Stored value is retrieved.', function () {
        var storage = new FileStorage();

        storage.set('item1', {a: 5, b: 'string'});
        assert.deepEqual(storage.get('item1'), {a: 5, b: 'string'});
    });

    it('Non-stored value returns undefined.', function () {
        var storage = new FileStorage();

        assert.isUndefined(storage.get('unknown-key'));
    });

    it('Stored value is overridden.', function () {
        var storage = new FileStorage();

        storage.set('item1', 'some thing');
        storage.set('item1', 5);
        storage.set('item1', true);

        assert.strictEqual(storage.get('item1'), true);
    });

    it('Stored value is verified using "has".', function () {
        var storage = new FileStorage();

        storage.set('item1', 'data');
        assert.isTrue(storage.has('item1'));
        assert.isFalse(storage.has('unknown-key'));
    });

    it('Deleted stored value cannot be retrieved.', function () {
        var storage = new FileStorage();

        storage.set('item1', 666);
        storage.del('item1');

        assert.isFalse(storage.has('item1'));
        assert.isUndefined(storage.get('item1'));
    });

    it('Delete unknown key does not fail.', function () {
        var storage = new FileStorage();

        storage.del('unknown-key');
    });
});