import Sync from 'ember-cli-sync-adapter';
import DS from 'ember-data';

export default Sync.Adapter.extend({
  remoteAdapter: DS.FixtureAdapter,
  localAdapter: DS.FixtureAdapter
});
