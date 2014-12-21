describe('Container', function () {

    var sinon = require('sinon');
    var assert = require('chai').assert;
    var cachejs = require('../../src/index');

    it('Initialized in NodeJS context.', function () {
        var cache = new cachejs.Container();
    });

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

});