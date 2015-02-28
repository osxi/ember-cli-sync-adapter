# WIP
This project is in heavy development.

# Ember-cli-sync-adapter
Ember-cli-sync-adapter(SA) is an adapter that wraps a local and a remote adapter by your choice. SA will use the remote adapter when online and use the local adapter when offline. SA will sync the local and remote adapter by performing queued operations accumulated during off-line mode.

SA assumes that there would be no conflicts when executing the
operations in the queue.

# TODO
1. overwrite Ember Data store#\_findAll method.
