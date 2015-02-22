import Ember from 'ember';
import Sync from 'ember-cli-sync-adapter';
import DS from 'ember-data';

export default Sync.Adapter.extend({
  remoteAdapter: DS.RESTAdapter.extend({
    host: 'http://no-such-thing',
  }),
  localAdapter: DS.FixtureAdapter
});
