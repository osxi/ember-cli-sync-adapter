import Ember from 'ember';
import DS    from 'ember-data';
import LocalStore from '../stores/local-store';

import findAll from '../methods/find-all';

var RSVP = Ember.RSVP;

export default DS.Adapter.extend({

  init: function() {
    this.set('remoteAdapter',    this.get('remoteAdapter').create());
    this.set('localAdapter',     this.get('localAdapter').create());

    this.set('remoteSerializer', this.get('remoteSerializer').create());
    this.set('localSerializer',  this.get('localSerializer').create());

    this.set('remoteDefaultSerializer',
             this.get('remoteAdapter.defaultSerializer'));
    this.set('localDefaultSerializer',
             this.get('localAdapter.defaultSerializer'));
    this.set('defaultSerializer', this.get('remoteDefaultSerializer'));

    // this.set('remoteStore', DS.Store.extend().create());
    var localStore = LocalStore
      .extend({
        adapter:   this.get('localAdapter'),
        container: this.get('container')
      })
      .create();
    this.set('localStore', localStore);
  },

  find: function(store, type, id, record) {
    var adapter = this;

    return adapter.get('remoteAdapter').find(store, type, id, record)
      .catch(function(error) {
        if(remoteIsDead(error.status)) {
          return adapter.get('localAdapter').find(store, type, id, record);
        } else {
          return RSVP.reject(error);
        }
      });
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
   * @param type {'local' | 'remote'}
   */
  changeSerializerTo: function(type) {
    this.set('defaultSerializer', this.get(type + 'DefaultSerializer'));
  },
  coalesceFindRequests: false,
  defaultSerializer: false,

  // A computed property?
  // serializer: function(record, options) {
  //   // READ: function ember$data$lib$system$store$$_findAll
  //   // This changed something! The error message is changed.
  //   debugger;
  //   return this._super(record, options);
  // },

  serialize: function(record, options) {
    // This is not called
    return this._super(record, options);
  }
});
