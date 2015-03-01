/* jshint expr:true */
/* global $ */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import { setHeaders } from '../helpers/async-helpers';

var App;

describe('Acceptance: Find ', function() {
  beforeEach(function() {
    App = startApp();
  });

  afterEach(function() {
    Ember.run(App, 'destroy');
  });

  it('show users when online', function(done) {
    setHeaders({ "isOnline": true});

    visit('/find');

    andThen(function() {
      expect(currentPath()).to.equal('find');
    });

    checkIdAndName('1', 'Trent');

    andThen(function() {
      done();
    });
  });

  it('show same user when offline', function(done) {
    // Online
    setHeaders({ "isOnline": true });

    visit('/find');

    checkIdAndName('1', 'Trent');

    // Offline
    setHeaders({ "isOnline": false });

    visit('/');
    visit('/find');

    checkIdAndName('1', 'Trent');

    andThen(function() {
      done();
    });
  });

  // TODO --------------------
  it('local data should change when online data is changed', function(done) {
    // NOTE: we can only increase, since ember data does not delete records when
    // doing findAll
    var firstUserName =  'Trent';
    var secondUserName = 'Yang';

    // ---------- First round
    // Online
    setHeaders({ "isOnline": true, "userName": firstUserName });

    visit('/');
    visit('/find');

    checkIdAndName('1', 'Trent');

    // Offline
    setHeaders({ "isOnline": false });

    visit('/');
    visit('/find');

    checkIdAndName('1', 'Trent');

    // ---------- Second round
    // Online again, count changed
    setHeaders({ "isOnline": true, "userName": secondUserName });

    visit('/');
    visit('/find');

    checkIdAndName('1', 'Yang');

    // Offline
    setHeaders({ "isOnline": false });

    visit('/');
    visit('/find');

    checkIdAndName('1', 'Yang');

    andThen(function() {
      done();
    });
  });

});

function checkIdAndName(id, name) {
  andThen(function() {
    expect(find('#find #id').text()).to.equal(id);
    expect(find('#find #name').text()).to.equal(name);
  });
}
