import Ember        from 'ember';
import SyncAdapter  from 'ember-cli-sync-adapter';
import DS           from 'ember-data';
import ENV          from 'dummy/config/environment';
import LFAdapter    from 'ember-localforage-adapter/adapters/localforage';
import LFSerializer from 'ember-localforage-adapter/serializers/localforage';
/* global Dummy */

export default SyncAdapter.extend({
  remoteAdapter: DS.RESTAdapter.extend({
    host: ENV.host,
    namespace: 'api'
  }),
  localAdapter: LFAdapter,

  remoteSerializer: DS.RESTSerializer,
  localSerializer:  LFSerializer,
});
