import Ember from 'ember';
import DS    from 'ember-data';

var RSVP = Ember.RSVP;

export default DS.Adapter.extend({

  init: function() {
    this.set('remoteAdapter',    this.get('remoteAdapter').create());
    this.set('localAdapter',     this.get('localAdapter').create());

    // TODO: check if we can use get('defaultSerializer') to get serializer
    this.set('remoteSerializer', this.get('remoteSerializer').create());
    this.set('localSerializer',  this.get('localSerializer').create());
    this.set('defaultSerializer',
             this.get('remoteAdapter').get('defaultSerializer'));
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
  findAll: function(store, type, sinceToken) {
    var adapter = this;

    return adapter.get('remoteAdapter').findAll(store, type, sinceToken)
      .then(function(payload) {
        // TODO: save to local
        var remoteSerializer = adapter.get('remoteSerializer');
        console.log(payload);
        // payload.users.forEach(function(data) {
        //   var record = this
        //   adapter.get('localAdapter').createRecord(store, type, data);
        // });
        return payload;
      })
      .catch(function(error) {
        if(remoteIsDead(error.status)) {
          return adapter.get('localAdapter').findAll(store, type, sinceToken);
        } else {
          return RSVP.reject(error);
        }
      });
  },

  findQuery: function(store, type, query) {
    return this.get('remoteAdapter').findQuery(store, type, query);
  },

  coalesceFindRequests: false,
  defaultSerializer: false
});

function remoteIsDead(status) {
  return status === 0;
}
