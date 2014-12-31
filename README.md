cachejs
=======

Cache container for nodejs and regular Javascript application.

[![NPM Version](https://img.shields.io/npm/v/cachejs.svg?style=flat)](https://npmjs.org/package/cache-js)
[![NPM Downloads](https://img.shields.io/npm/dm/cachejs.svg?style=flat)](https://npmjs.org/package/cache-js)
[![Build Status](https://img.shields.io/travis/gghez/cachejs.svg?style=flat)](https://travis-ci.org/gghez/cachejs)

## Why

CacheJS is a Cache container, it is designed to be a common cache interface, storage independent.

## Installation and usage

In node application context:

```
npm install cachejs
```

```js
var cachejs = require('cachejs');
var container = cachejs.Container();

var obj = { ... };
container.set('objid', obj, { lifetime: 5000 }); // store in cache for 5 sec.
...
var cachedObj = container.get('objid'); // retrieve from cache
```

In regular Javascript application context:

```
bower install cachejs
```

```html
<script src="bower_components/cachejs/cache.js"></script>
<script src="bower_components/cachejs/storage/memory.js"></script>
<script src="bower_components/cachejs/cacheitem.js"></script>
<script src="bower_components/cachejs/container.js"></script>
<script>
var cache = new cachejs.Container();

// Same example than in NodeJS context.
</script>
```

All cachejs objects are located in **CacheJS** namespace of **window**.

## API

### Container

```Container``` is a generic cache container model, its default store engine is ```MemoryCacheContainer```. See Store Engine section for more information.

#### Container(options)

Container constructor accepts options object as unique parameter to configure it. Options may be overriden once created using ```options``` instance function.

#### .options(optKey [, optValue])

Get or set an option for this container.

##### <a name="options"></a>Container options

Option             | Default              | Description
-------------------|----------------------|--------------
lifetime           | false                | The default lifetime for stored objects in ms. Set ```false``` evaluated or negative expression for infinite lifetime.
onUpdate           | -                    | Callback ```function(objKey, oldVal, newVal)``` used each time an object is created or updated in container.
onExpiry           | -                    | Callback ```function(cacheItem)```used each time an object expires in container. May be used to create an auto-refresh process for ```cacheItem.key``` value.
storage            | 'memory'             | Storage engine ```{String|Function}```. Native engines are 'memory'... (sorry that's all for now)
pruningInterval    | 60000                | Interval (in ms.) container checks for expired cache items

#### .set(objKey, obj [, options])

Stores ```obj``` in cache associated with ```objKey``` reference for further retrieving.

```options``` parameter allow to specify some cache feature related to this stored item. This object is the same used to specify container options and overrides already defined container options. See [Container options](#options).

Returns the stored cache item.

**CacheItem**

Property           | Description
-------------------|--------------
storedAt           | Storage date (Javascript ```Date``` object)

Function           | Description
-------------------|--------------
isExpired          | Indicates whether cache value has expired or not
value              | Get or set cache item value.

Option             | Description
-------------------|--------------
lifetime           | Lifetime of this cache item
onExpiry           | Callback used when cache item lifetime expires. Default value is container's one.
onUpdate           | Callback used when cache item value is updated. Default value is container's one.

Example:
```js
var cacheItem = container.set('basket', { // Object stored
    customerEmail: 'john.doe@domain.ext',
    items: [
      { articleId: 45, quantity: 2 },
      { articleId: 12, quantity: 1 }
    ]
  }, {
    lifetime: 24 * 3600 * 1000, // 24h
    onExpiry: function(cacheItem) {
      // cacheItem.lifetime === 24 * 3600 * 1000
      // cacheItem.onExpiry === this
      
      // mailSender is a fake for this example
      var basket = cacheItem.getValue()
      mailSender.send(basket.customerEmail,
        'Hi, your basket created at ' + cacheItem.storedAt + ' has just expired.');
    }
  });

// Set option
cacheItem.options('lifetime', 5000);

// Get option
var updateCallback = cacheItem.options('onUpdate');
```

_Nota bene_: Some readonly fields are added to CacheItem instance once created: ```storedAt``` and cannot be overridden.

#### .get(objKey)

Retrieves a non-expired value from cache. ```objKey``` is the cache key of stored value. To retrieve item independently of its expired state, use [```getItem```](#getItem) instead.

When no value retrieved for given ```objKey```, returns ```null```.

#### .has(objKey)

Returns ```true``` whether key ```objKey``` reference a valid (not expired) value in cache, otherwise ```false ```.

#### <a name="getItem"></a>.getItem(objKey)

Retrieves an object cache item from cache or ```null```.

```js
var item = cache.getItem('basket');
/* item object:
{
  key: 'basket',
  storedAt: 1419153019947, // Ticks (e.g.: new Date().getTime())
  lifetime: 86400000, // 24h
  onUpdate: undefined,
  onExpiry: function(){ ... },
  isExpired: function() { ... }, // Returns true or false
  value: { ... } // cached object
}
*/
```

#### .prune()

Remove all expired items from cache container and aises ```onExpiry``` of all removed items.