import DS    from 'ember-data';

export default DS.Adapter.extend({

  init: function() {
    this.set('local', this.get('localAdapter').create());
    this.set('remote', this.get('remoteAdapter').create());
  },

  find: function(store, type, id, record) {
    return this.get('remote').find(store, type, id, record);
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
    return this.get('remote').findAll(store, type, sinceToken);
  },

  findQuery: function(store, type, query) {
    return this.get('remote').findQuery(store, type, query);
  },

  coalesceFindRequests: false,
  defaultSerializer: false
});
