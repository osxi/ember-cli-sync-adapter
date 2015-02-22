import DS from 'ember-data';

var User = DS.Model.extend({
  name: DS.attr('string'),
});

User.reopenClass({
  FIXTURES: [
    { id: 1, name: 'Chun' },
    { id: 2, name: 'John' },
    { id: 3, name: 'Daniel' },
  ]
});

export default User;
