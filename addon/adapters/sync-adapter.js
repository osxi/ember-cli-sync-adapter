import DS    from 'ember-data';
import LocalStore from '../stores/local-store';

import findAll from './sync-adapter/find-all';

export default DS.Adapter.extend({

  init: function() {
    var remoteDefaultSerializer, localDefaultSerializer;

    // initialize adapters
    this.set('remoteAdapter',    this.get('remoteAdapter').create());
    this.set('localAdapter',     this.get('localAdapter').create());

    // defaultSerializers are strings
    remoteDefaultSerializer = this.get('remoteAdapter.defaultSerializer');
    localDefaultSerializer  = this.get('localAdapter.defaultSerializer');
    this.set('remoteDefaultSerializer', remoteDefaultSerializer);
    this.set('localDefaultSerializer',  localDefaultSerializer);
    this.set('defaultSerializer',       remoteDefaultSerializer);

    // serializers are objects
    this.set('remoteSerializer', this.get('remoteSerializer').create());
    this.set('localSerializer',  this.get('localSerializer').create());

    // This is used to dispose useless records
    var localStore = LocalStore
      .extend({
        adapter:   this.get('localAdapter'),
        container: this.get('container')
      })
      .create();
    this.set('localStore', localStore);
  },

  find: function(store, type, id, record) {
    return this.get('remoteAdapter').find(store, type, id, record);
  },

  createRecord: function(store, type, record) {
    return this.get('remoteAdapter').createRecord(store, type, record);
  },

  updateRecord: function(store, type, record) {
    return this.get('remoteAdapter').updateRecord(store, type, record);
  },

  deleteRecord: function(store, type, record) {
    return this.get('remoteAdapter').deleteRecord(store, type, record);
  },

  /**
   * Whenever we call findAll, we reload local data using the remote ones
   */
  findAll: findAll,

  findQuery: function(store, type, query) {
    return this.get('remoteAdapter').findQuery(store, type, query);
  },

  /**
   * change default serializer
   * @param source {'local' | 'remote'}
   */
  changeSerializerTo: function(source) {
    this.set('defaultSerializer', this.get(source + 'DefaultSerializer'));
  },
  defaultSerializer: false,

  coalesceFindRequests: false,
  serialize: function(record, options) {
    // This is not called
    return this._super(record, options);
  }
});
