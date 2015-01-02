describe('Custom Storage', function () {

    var sinon, assert, cachejs;

    if (typeof module == 'object' && typeof require == 'function') {
        sinon = require('sinon');
        assert = require('chai').assert;
        cachejs = require('../src/cache');
    } else {
        sinon = window.sinon;
        assert = window.chai.assert;
        cachejs = window.cachejs;
    }

    var container, storage;

    beforeEach(function () {
        storage = {
            get: sinon.stub(),
            set: sinon.stub(),
            del: sinon.stub(),
            has: sinon.stub(),
            keys: sinon.stub().returns([])
        };
        container = new cachejs.Container({storage: storage});
    });


    it('Store value should call storage "set".', function () {

        var item = container.set('item1', 'some value');

        assert.isTrue(storage.set.calledWith('item1', {item: item, value: 'some value'}));
    });

    it('Get value should call storage "has" and "get".', function () {
        container.set('item1', 'some value');
        container.get('item1');

        assert.isTrue(storage.get.calledWith('item1'));
    });



});