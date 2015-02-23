import Ember from 'ember';
import Sync from 'ember-cli-sync-adapter';
import DS from 'ember-data';
import ENV from 'dummy/config/environment';

export default Sync.Adapter.extend({
  // IMPORTANT! User need to add this line!
  defaultSerializer: '-rest',
  remoteAdapter: DS.RESTAdapter.extend({
    host: ENV.host,
    namespace: 'api'
  }),
  localAdapter: DS.FixtureAdapter
});
