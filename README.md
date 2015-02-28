# WIP
This project is in heavy development.

# Ember-cli-sync-adapter
Ember-cli-sync-adapter(SA) is an adapter that wraps a local and a remote adapter by your choice. SA will use the remote adapter when online and use the local adapter when offline. SA will sync the local and remote adapter by performing queued operations accumulated during off-line mode.

SA assumes that there would be no conflicts when executing the
operations in the queue.

# TODO
1. clean up init, use as less input as possible
2. #find
3. #findQuery
4. #createRecord
5. #updateRecord
6. #deleteRecord
7. Add a service to:
  1. save local operations in offline mode into a queue
  2. try to push the queue to the server when online (maybe periodically)
  3. fetch remote data when online (maybe periodically)
