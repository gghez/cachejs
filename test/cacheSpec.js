describe('Container', function () {

    var sinon, assert, cachejs;

    if (typeof module == 'object') {
        sinon = require('sinon');
        assert = require('chai').assert;
        cachejs = require('../src/index');
    } else {
        sinon = window.sinon;
        assert = window.chai.assert;
        cachejs = window.CacheJS;
    }

    it('Initialized in current context.', function () {
        var cache = new cachejs.Container();
    });

    describe('Defaults and Options', function () {
        it('Options are well defined.', function () {
            var onExpiry = sinon.stub();
            var onUpdate = sinon.stub();

            var cache = new cachejs.Container({
                lifetime: 3500,
                onExpiry: onExpiry,
                onUpdate: onUpdate,
                storage: 'file'
            });

            assert.equal(cache.options('lifetime'), 3500);
            assert.equal(cache.options('onExpiry'), onExpiry);
            assert.equal(cache.options('onUpdate'), onUpdate);
            assert.equal(cache.options('storage'), 'file');
        });

        it('Options can be overriden.', function () {
            var onExpiry = sinon.stub();
            var onUpdate = sinon.stub();

            var cache = new cachejs.Container({
                lifetime: 1750,
                onExpiry: sinon.stub(),
                onUpdate: sinon.stub(),
                storage: 'mongo'
            });

            cache.options('lifetime', 3500);
            cache.options('onExpiry', onExpiry);
            cache.options('onUpdate', onUpdate);
            cache.options('storage', 'file');

            assert.equal(cache.options('lifetime'), 3500);
            assert.equal(cache.options('onExpiry'), onExpiry);
            assert.equal(cache.options('onUpdate'), onUpdate);
            assert.equal(cache.options('storage'), 'file');
        });

        it('Default storage is "memory".', function () {
            var cache = new cachejs.Container();

            assert.equal(cache.options('storage'), 'memory');
        });

        it('Default lifetime is infinite.', function () {
            var cache = new cachejs.Container();

            assert.isFalse(cache.options('lifetime'));
        });
    });

    describe('Usages', function () {
        it('Stored item is retrieved.', function () {
            var cache = new cachejs.Container();
            cache.set('item1', {a: 5, b: 'string'});

            assert.deepEqual(cache.get('item1'), {a: 5, b: 'string'});
        });

        it('Stored item raise onUpdate from container.', function () {
            var cache = new cachejs.Container({onUpdate: sinon.spy()});
            cache.set('item1', {a: 5, b: 'string'});

            assert.isTrue(cache.options('onUpdate').calledOnce);
            assert.isTrue(cache.options('onUpdate').calledWith('item1', {a: 5, b: 'string'}));
        });

        it('Stored item raise onUpdate from cache item.', function () {
            var cache = new cachejs.Container();
            var cacheItem = cache.set('item1', {a: 5, b: 'string'}, {onUpdate: sinon.spy()});

            assert.isTrue(cacheItem.onUpdate.calledOnce);
            assert.isTrue(cacheItem.onUpdate.calledWith('item1', {a: 5, b: 'string'}));
        });

        it('Stored item raise onExpiry on container when expired.', function (done) {
            var cache = new cachejs.Container({onExpiry: sinon.spy(), pruningInterval: 10});
            var cacheItem = cache.set('item1', {a: 5, b: 'string'}, {lifetime: 100});

            setTimeout(function () {
                assert.isTrue(cache.options('onExpiry').notCalled);
            }, 50);

            setTimeout(function () {
                assert.isTrue(cache.options('onExpiry').calledOnce);
                assert.isTrue(cache.options('onExpiry').calledWith(cacheItem));
                done();
            }, 150);
        });

        it('Stored item raise onExpiry on cache item when expired.', function (done) {
            var cache = new cachejs.Container({pruningInterval: 10});
            var cacheItem = cache.set('item1', {a: 5, b: 'string'}, {
                lifetime: 100,
                onExpiry: sinon.spy()
            });

            setTimeout(function () {
                assert.isTrue(cacheItem.onExpiry.notCalled);
            }, 50);

            setTimeout(function () {
                assert.isTrue(cacheItem.onExpiry.calledOnce);
                assert.isTrue(cacheItem.onExpiry.calledWith(cacheItem));
                done();
            }, 150);
        });

        it('Expired item has its value removed from cache and storage.', function (done) {
            var cache = new cachejs.Container({pruningInterval: 10});
            cache.set('item1', {a: 5, b: 'string'}, {
                lifetime: 100,
                onExpiry: function (cacheItem) {
                    assert.isUndefined(cacheItem.value());
                    assert.notInclude(Object.keys(cache._items), cacheItem.key);
                    assert.notInclude(Object.keys(cacheItem._storage._hash), cacheItem.key);
                    done();
                }
            });
        });

    });


});