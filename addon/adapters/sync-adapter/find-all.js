import isConnectionError from '../utils/is-connection-error';
import Ember from 'ember';
var RSVP = Ember.RSVP;

export default function findAll(store, type, sinceToken) {
  var adapter = this;
  var remoteAdapter = adapter.get('remoteAdapter');
  var localAdapter  = adapter.get('localAdapter');
  var remoteSerializer = adapter.get('remoteSerializer');
  var localSerializer  = adapter.get('localSerializer');

  return findAllFromRemote()
    .then(refreshLocalData)
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

  function refreshLocalData(payload) {
    // https://github.com/emberjs/data/blob/1.0.0-beta.15/packages/ember-data/lib/system/store.js#L1632
    // TODO: delete all records before saving new ones

    // we should do this async to improve performance.
    return deleteAllRecordsInLocal()
      .then(createRecordsInLocal.bind(adapter, payload))
      .catch(function(error) { Ember.Logger.error(error && error.stack); })
      .then(
        function() { adapter.changeSerializerTo('remote'); return payload; },
        function() { adapter.changeSerializerTo('remote'); return payload; }
      );
  }

  function deleteAllRecordsInLocal() {
    adapter.changeSerializerTo('local');
    return findAllFromLocal().then(function(payload) {
      // FIXME: hack, there is a bug in localForage adapter
      localSerializer.set('container', adapter.get('container'));

      var rawRecords = localSerializer.extractArray(store, type, payload);

      var deletedRecords = rawRecords.map(function(rawRecord) {
        var record = createRecordWithId(type, rawRecord.id);
        return localAdapter.deleteRecord(store, type, record);
      });

      return RSVP.all(deletedRecords);
    });
  }

  function createRecordsInLocal(payload) {
    var rawRecords = remoteSerializer.extractArray(store, type, payload);
    return rawRecords.forEach(createRecordInLocal);
  }

  function createRecordInLocal(rawRecord) {
    var record = createRecordWithId(type, rawRecord.id);

    // var record = type._create({
    //   id:        rawRecord.id,
    //   store:     adapter.get('localStore'),
    //   container: adapter.get('container'),
    // });

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
