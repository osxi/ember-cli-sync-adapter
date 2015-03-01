import isConnectionError from '../utils/is-connection-error';
import Ember from 'ember';
var RSVP = Ember.RSVP;

export default function find(store, type, id, record) {
  var adapter = this;
  var remoteSerializer = adapter.get('remoteSerializer');

  return findFromRemote()
    .then(updateOrCreateLocalRecord)
    .catch(function(error) {
      return isConnectionError(error && error.status) ?
        findFromLocal() :
        RSVP.reject(error);
    });

  function findFromRemote() {
    adapter.changeSerializerTo('remote');
    return adapter.get('remoteAdapter').find(store, type, id, record);
  }

  function updateOrCreateLocalRecord(payload) {
    var rawRecord = remoteSerializer
      .extract(store, type, payload, id, 'find');

    // FIXME: hack, we should check if the record exists using local adapter
    // right now everthing works just fine, so change this latter.
    var record = createRecordWithId(type, rawRecord.id);

    record.setupData(rawRecord);

    adapter.get('localAdapter').createRecord(store, type, record);

    return payload;
  }

  // TODO: refactor, duplicate in find-all
  function createRecordWithId(type, id) {
    // use a localStore is necessary, otherwise the records will be saved in the
    // applicaiton store twice
    return type._create({
      id:        id,
      store:     adapter.get('localStore'),
      container: adapter.get('container'),
    });
  }

  function findFromLocal() {
    adapter.changeSerializerTo('local');
    return adapter.get('localAdapter').find(store, type, id, record);
  }
}
