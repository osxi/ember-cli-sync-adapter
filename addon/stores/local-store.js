import DS from 'ember-data';

// We assume the user does not configure local adapter, and always use default
// adapter
export default DS.Store.extend({
  // adapterFor: function() {
  //   return this.get('adapter');
  // }
});
