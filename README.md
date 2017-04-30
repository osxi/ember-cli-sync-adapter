# Goal:

[![Greenkeeper badge](https://badges.greenkeeper.io/osxi/ember-cli-sync-adapter.svg)](https://greenkeeper.io/)
Make any ember app that use ember data offline by:
```javascript
// app/adapters/application.js
export default SyncAdapter.extend({
  remoteAdapter:    DS.RESTAdapter,
  localAdapter:     LFAdapter,
  remoteSerializer: DS.RESTSerializer,
  localSerializer:  LFSerializer,
});
```

# Ember-cli-sync-adapter
Ember-cli-sync-adapter(SA) is an adapter that wraps a local and a remote adapter by your choice. SA will use the remote adapter when online and use the local adapter when offline. SA will sync the local and remote adapter by performing queued operations accumulated during off-line mode.

SA assumes that there would be no conflicts when executing the
operations in the queue.

# TODO
1. <del>clean up init, use as less input as possible</del>
1. <del>#findAll</del>
1. <del>#find</del>
1. #findQuery
1. #createRecord
1. #updateRecord
1. #deleteRecord
1. Add a service to:
  1. save local operations in offline mode into a queue
  2. try to push the queue to the server when online (maybe periodically)
  3. fetch remote data when online (maybe periodically)

# Resources
1. [ember cli addon] (http://www.ember-cli.com/#developing-addons-and-blueprints)
2. [ember data store.js] (https://github.com/emberjs/data/blob/v1.0.0-beta.15/packages/ember-data/lib/system/store.js)
3. [ember data adapter.js] (https://github.com/emberjs/data/blob/v1.0.0-beta.15/packages/ember-data/lib/system/adapter.js)
4. [ember data serializer.js] (https://github.com/emberjs/data/blob/v1.0.0-beta.15/packages/ember-data/lib/system/serializer.js)
5. [localforage ember adatper] (https://github.com/genkgo/ember-localforage-adapter/)
6. [ember dependency injection] (http://emberjs.com/guides/understanding-ember/dependency-injection-and-service-lookup/)
