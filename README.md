# Ember-cli-sync-adapter
Ember-cli-sync-adapter(SyncAdapter) is an adapter that wraps a local and a remote adapter by your choice. SyncAdapter will use the remote adapter when online and use the local adapter when offline. SyncAdapter will sync the local and remote adapter by performing queued operations accumulated during off-line mode.

SyncAdapter assumes that there would be no conflicts when executing the
operations in the queue.
