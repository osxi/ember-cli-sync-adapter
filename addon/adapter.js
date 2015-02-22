import Ember from 'ember';
import DS    from 'ember-data';

var RSVP = Ember.RSVP;

export default DS.Adapter.extend({

  init: function() {
    this.set('local', this.get('localAdapter').create());
    this.set('remote', this.get('remoteAdapter').create());
  },

  find: function(store, type, id, record) {
    var adapter = this;

    return adapter.get('remote').find(store, type, id, record)
      .catch(function(error) {
        if(remoteIsDead(error.status)) {
          return adapter.get('local').find(store, type, id, record);
        } else {
          return RSVP.reject(error);
        }
      });
  },

  createRecord: function(store, type, record) {
    return this.get('remote').createRecord(store, type, record);
  },

  updateRecord: function(store, type, record) {
    return this.get('remote').updateRecord(store, type, record);
  },

  deleteRecord: function(store, type, record) {
    return this.get('remote').deleteRecord(store, type, record);
  },

  findAll: function(store, type, sinceToken) {
    var adapter = this;

    return adapter.get('remote').findAll(store, type, sinceToken)
      .catch(function(error) {
        if(remoteIsDead(error.status)) {
          return adapter.get('local').findAll(store, type, sinceToken);
        } else {
          return RSVP.reject(error);
        }
      });
  },

  findQuery: function(store, type, query) {
    return this.get('remote').findQuery(store, type, query);
  },

  coalesceFindRequests: false,
  defaultSerializer: false
});

function remoteIsDead(status) {
  return status === 0;
}
