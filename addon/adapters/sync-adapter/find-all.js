import isConnectionError from '../utils/is-connection-error';
import Ember from 'ember';
var RSVP = Ember.RSVP;

/**
 * Whenever we call findAll, we reload local data using the remote ones
 */
export default function findAll(store, type, sinceToken) {
  var adapter = this;
  var remoteAdapter = adapter.get('remoteAdapter');
  var localAdapter  = adapter.get('localAdapter');
  var remoteSerializer = adapter.get('remoteSerializer');
  var localSerializer  = adapter.get('localSerializer');

  return findAllFromRemote()
    .then(refreshLocalRecords)
    .catch(function(error) {
      return isConnectionError(error && error.status) ?
        findAllFromLocal() :
        RSVP.reject(error);
    });

  function findAllFromRemote() {
    adapter.changeSerializerTo('remote');
    return remoteAdapter.findAll(store, type, sinceToken);
  }

  function findAllFromLocal() {
    adapter.changeSerializerTo('local');
    return localAdapter.findAll(store, type, sinceToken);
  }

  function refreshLocalRecords(payload) {
    // https://github.com/emberjs/data/blob/1.0.0-beta.15/packages/ember-data/lib/system/store.js#L1632
    // TODO: delete all records before saving new ones

    // we should do this async to improve performance.
    return deleteAllInLocal()
      .then(createAllInLocal.bind(adapter, payload))
      .catch(function(error) { Ember.Logger.error(error && error.stack); })
      .then(
        function() { adapter.changeSerializerTo('remote'); return payload; },
        function() { adapter.changeSerializerTo('remote'); return payload; }
      );
  }

  function deleteAllInLocal() {
    adapter.changeSerializerTo('local');
    return findAllFromLocal().then(function(payload) {
      var rawRecords = localSerializer
        .extract(store, type, payload, null, 'findAll');

      var deletedRecords = rawRecords.map(function(rawRecord) {
        var record = createRecordWithId(type, rawRecord.id);
        return localAdapter.deleteRecord(store, type, record);
      });

      return RSVP.all(deletedRecords);
    });
  }

  function createAllInLocal(payload) {
    var rawRecords = remoteSerializer
      .extract(store, type, payload, null, 'findAll');

    return rawRecords.forEach(createRecordInLocal);
  }

  function createRecordInLocal(rawRecord) {
    var record = createRecordWithId(type, rawRecord.id);

    record.setupData(rawRecord);

    adapter.get('localAdapter').createRecord(store, type, record);
  }

  function createRecordWithId(type, id) {
    // use a localStore is necessary, otherwise the records will be saved in the
    // applicaiton store twice
    return type._create({
      id:        id,
      store:     adapter.get('localStore'),
      container: adapter.get('container'),
    });
  }
}
