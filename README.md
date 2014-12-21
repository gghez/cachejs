cachejs
=======

Cache container for nodejs and regular Javascript application.

## Installation and usage

In node application context:

```
npm install cachejs
```

```js
var cache = require('cachejs').Container();

var obj = { ... };
cache.set('objid', obj); // store in cache
...
var cachedObj = cache.get('objid'); // retrieve from cache
```

In regular Javascript application context:

```
bower install cachejs
```

```html
<script src="bower_components/cachejs/cachejs.js"></script>
```

```js
var cache = new CacheJS.Container();

// Same example than in NodeJS context.
```

## API

### Container

```Container``` is a generic cache container model, its default store engine is ```MemoryCacheContainer```. See Store Engine section for more information.

#### .options(optKey [, optValue])

Get or set an option for this container.

##### <a name="options"></a>Container options

Option             | Default              | Description
-------------------|----------------------|--------------
lifetime           | false                | The default lifetime for stored objects in ms. Set ```false``` evaluated or negative expression for infinite lifetime.
onUpdate           | -                    | Callback ```function(objKey, oldVal, newVal, options)``` used each time an object iq created or updated in container.
onExpiry           | -                    | Callback ```function(cacheItem)```used each time an object expires in container. May be used to create an auto-refresh process for ```cacheItem.key``` value.


#### .set(objKey, obj [, options])

Stores ```obj``` in cache associated with ```objKey``` reference for further retrieving.

```options``` parameter allow to specify some cache feature related to this stored item. This object is the same used to specify container options and overrides already defined container options. See [Container options](#options).

#### .setItem(objKey, cacheItem)

Stores a cache item associated with ```objKey``` reference.

```js
cache.setItem('basket', {
  lifetime: 24 * 3600 * 1000, // 24h
  onExpiry: function(objKey, options) {
    // options.lifetime === 24 * 3600 * 1000
    // options.onExpiry === this
    
    // mailSender is a fake for this example
    var basket = options.value
    mailSender.send(options.value.customerEmail, 'Hi, your basket created at ' + options.storedAt + ' has just expired.');
  },
  value: {
    customerEmail: 'john.doe@domain.ext',
    creationDate: new Date(),
    items: [
      { articleId: 45, quantity: 2 },
      { articleId: 12, quantity: 1 }
    ]
  }
});
```

Some readonly fields will be added to this cache item once created: ```createdAt```, ```function isExpired()```

#### .get(objKey)

Retrieves a non-expired value from cache. ```objKey``` is the cache key of stored value. To retrieve item independently of its expired state, use ```getItem``` instead.

### .getItem(objKey)

Retrieves an object cache item from cache. Cache item prototype:
```js
{
  key: 'basket',
  storedAt: 1419153019947, // Ticks (e.g.: new Date().getTime())
  lifetime: 86400000, // 24h
  onUpdate: undefined,
  onExpiry: function(){ ... },
  isExpired: function() { ... }, // Returns true or false
  value: { ... } // cached object
}
```

#### .has(objKey)

Indicates whether object cache key ```objKey``` reference an object in cache.

