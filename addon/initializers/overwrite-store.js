import Ember from 'ember';
var Promise = Ember.RSVP.Promise;
var get     = Ember.get;
var set     = Ember.set;

// https://github.com/emberjs/data/blob/v1.0.0-beta.15/packages/ember-data/lib/system/promise_proxies.js
import DS from "ember-data";
var PromiseArray = DS.PromiseArray;
var promiseArray = function(promise, label) {
  return PromiseArray.create({
    promise: Promise.resolve(promise, label)
  });
};

export function initialize(container /* , application */) {
  var store = container.lookup('store:main');
  store.set('_fetchAll', _fetchAll);
  store.set('fetchRecord', fetchRecord);
}

export default {
  after: 'store',
  name: 'ember-sync-overwrite-store',
  initialize: initialize
};

// https://github.com/emberjs/data/blob/v1.0.0-beta.15/packages/ember-data/lib/system/store.js
function _fetchAll(type, array) {
  var adapter = this.adapterFor(type);
  var sinceToken = this.typeMapFor(type).metadata.since;

  set(array, 'isUpdating', true);

  Ember.assert("You tried to load all records but you have no adapter (for " + type + ")", adapter);
  Ember.assert("You tried to load all records but your adapter does not implement `findAll`", typeof adapter.findAll === 'function');

  return promiseArray(_findAll(adapter, this, type, sinceToken));
}

// _fetchAll BEGIN
function _findAll(adapter, store, type, sinceToken) {
  var promise = adapter.findAll(store, type, sinceToken);
  // Diff line deleted
  var label = "DS: Handle Adapter#findAll of " + type;

  promise = Promise.cast(promise, label);
  promise = _guard(promise, _bind(_objectIsAlive, store));

  return promise.then(function(adapterPayload) {
    _adapterRun(store, function() {
      // Diff line added
      var serializer = serializerForAdapter(adapter, type);
      var payload = serializer.extract(store, type, adapterPayload, null, 'findAll');

      Ember.assert("The response from a findAll must be an Array, not " + Ember.inspect(payload), Ember.typeOf(payload) === 'array');

      store.pushMany(type, payload);
    });

    store.didUpdateAll(type);
    return store.all(type);
  }, null, "DS: Extract payload of findAll " + type);
}

function serializerForAdapter(adapter, type) {
  var serializer = adapter.serializer;
  var defaultSerializer = adapter.defaultSerializer;
  var container = adapter.container;

  if (container && serializer === undefined) {
    serializer = serializerFor(container, type.typeKey, defaultSerializer);
  }

  if (serializer === null || serializer === undefined) {
    serializer = {
      extract: function(store, type, payload) { return payload; }
    };
  }

  return serializer;
}

function serializerFor(container, type, defaultSerializer) {
  return container.lookup('serializer:'+type) ||
                 container.lookup('serializer:application') ||
                 container.lookup('serializer:' + defaultSerializer) ||
                 container.lookup('serializer:-default');
}

function _guard(promise, test) {
  var guarded = promise['finally'](function() {
    if (!test()) {
      guarded._subscribers.length = 0;
    }
  });

  return guarded;
}

function _bind(fn) {
  var args = Array.prototype.slice.call(arguments, 1);

  return function() {
    return fn.apply(undefined, args);
  };
}

function _objectIsAlive(object) {
  return !(get(object, "isDestroyed") || get(object, "isDestroying"));
}

function _adapterRun(store, fn) {
  return store._backburner.run(fn);
}
// _fetchAll END

// fetchRecord BEGIN
// https://github.com/emberjs/data/blob/v1.0.0-beta.15/packages/ember-data/lib/system/store.js#L623
function fetchRecord(record) {
  var type = record.constructor;
  var id = get(record, 'id');
  var adapter = this.adapterFor(type);

  Ember.assert("You tried to find a record but you have no adapter (for " + type + ")", adapter);
  Ember.assert("You tried to find a record but your adapter (for " + type + ") does not implement 'find'", typeof adapter.find === 'function');

  var promise = _find(adapter, this, type, id, record);
  return promise;
}

function _find(adapter, store, type, id, record) {
  var promise = adapter.find(store, type, id, record);
  // Diff line deleted
  var label = "DS: Handle Adapter#find of " + type + " with id: " + id;

  promise = Promise.cast(promise, label);
  promise = _guard(promise, _bind(_objectIsAlive, store));

  return promise.then(function(adapterPayload) {
    Ember.assert("You made a request for a " + type.typeKey + " with id " + id + ", but the adapter's response did not have any data", adapterPayload);
    return _adapterRun(store, function() {
      // Diff line added
      var serializer = serializerForAdapter(adapter, type);
      var payload = serializer.extract(store, type, adapterPayload, id, 'find');

      return store.push(type, payload);
    });
  }, function(error) {
    var record = store.getById(type, id);
    if (record) {
      record.notFound();
      if (get(record, 'isEmpty')) {
        store.unloadRecord(record);
      }
    }
    throw error;
  }, "DS: Extract payload of '" + type + "'");
}
// fetchRecord END
