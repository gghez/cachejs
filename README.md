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
<script>
var cache = new CacheJS.Container();

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
onUpdate           | -                    | Callback ```function(objKey, oldVal, newVal, options)``` used each time an object iq created or updated in container.
onExpiry           | -                    | Callback ```function(cacheItem)```used each time an object expires in container. May be used to create an auto-refresh process for ```cacheItem.key``` value.


#### .set(objKey, obj [, options])

Stores ```obj``` in cache associated with ```objKey``` reference for further retrieving.

```options``` parameter allow to specify some cache feature related to this stored item. This object is the same used to specify container options and overrides already defined container options. See [Container options](#options).

#### .get(objKey)

Retrieves a non-expired value from cache. ```objKey``` is the cache key of stored value. To retrieve item independently of its expired state, use [```getItem```](#getItem) instead.

When no value retrieved for given ```objKey```, returns ```null```.

#### .has(objKey)

Returns ```true``` whether key ```objKey``` reference a valid (not expired) value in cache, otherwise ```false ```.

#### .setItem(objKey, cacheItem)

Stores a cache item associated with ```objKey``` reference.

```js
cache.setItem('basket', {
  lifetime: 24 * 3600 * 1000, // 24h
  onExpiry: function(cacheItem) {
    // cacheItem.lifetime === 24 * 3600 * 1000
    // cacheItem.onExpiry === this
    
    // mailSender is a fake for this example
    var basket = cacheItem.value
    mailSender.send(cacheItem.value.customerEmail,
      'Hi, your basket created at ' + cacheItem.storedAt + ' has just expired.');
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

_Nota bene_: Some readonly fields will be added to this cache item once created: ```storedAt```, ```function isExpired()``` and cannot be overriden.

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
