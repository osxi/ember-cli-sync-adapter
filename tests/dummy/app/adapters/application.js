import Ember        from 'ember';
import Sync         from 'ember-cli-sync-adapter';
import DS           from 'ember-data';
import ENV          from 'dummy/config/environment';
import LFAdapter    from 'ember-localforage-adapter/adapters/localforage';
import LFSerializer from 'ember-localforage-adapter/serializers/localforage';

export default Sync.Adapter.extend({
  // IMPORTANT! Delete this and make it work
  defaultSerializer: '-rest',

  remoteAdapter: DS.RESTAdapter.extend({
    host: ENV.host,
    namespace: 'api'
  }),
  localAdapter: LFAdapter,

  // TODO: use adapter name to get serializer name
  remoteSerializer: DS.RESTSerializer,
  localSerializer:  LFSerializer,
});
