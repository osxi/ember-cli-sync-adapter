# WIP
This project is in heavy development.

# Ember-cli-sync-adapter
Ember-cli-sync-adapter(SSA) is an adapter that wraps a local and a remote adapter by your choice. SSA will use the remote adapter when online and use the local adapter when offline. SSA will sync the local and remote adapter by performing queued operations accumulated during off-line mode.

SSA assumes that there would be no conflicts when executing the
operations in the queue.
