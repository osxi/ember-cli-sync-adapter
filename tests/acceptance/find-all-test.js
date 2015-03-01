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

var App;

describe('Acceptance: FindAll', function() {
  beforeEach(function() {
    App = startApp();
  });

  afterEach(function() {
    Ember.run(App, 'destroy');
  });

  it('show users when online', function(done) {
    var count = 4;

    andThen(function() {
      $.ajaxSetup({
        headers: {
          "isOnline": true,
          "usersCount": count
        }
      });
    });

    visit('/find-all');

    andThen(function() {
      expect(currentPath()).to.equal('find-all');
      expect(find('#find-all ul li').length).to.equal(count);
    });

    andThen(function() {
      done();
    });
  });

  it('show same users when offline', function(done) {
    var count = 4;

    // Online
    andThen(function() {
      $.ajaxSetup({
        headers: {
          "isOnline": true,
          "usersCount": count
        }
      });
    });

    visit('/find-all');

    andThen(function() {
      expect(find('#find-all ul li').length).to.equal(count);
    });

    // Offline
    andThen(function() {
      $.ajaxSetup({
        headers: {
          "isOnline": false,
          "usersCount": count
        }
      });
    });

    visit('/');
    visit('/find-all');

    andThen(function() {
      expect(find('#find-all ul li').length).to.equal(count);
    });

    andThen(function() {
      done();
    });
  });

  it('local data should change when online data is changed', function(done) {
    // NOTE: we can only increase, since ember data does not delete records when
    // doing findAll
    var firstCount = 2;
    var secondCount = 4;

    // ---------- First round
    // Online
    andThen(function() {
      $.ajaxSetup({
        headers: {
          "isOnline": true,
          "usersCount": firstCount
        }
      });
    });

    visit('/');
    visit('/find-all');

    andThen(function() {
      expect(find('#find-all ul li').length).to.equal(firstCount);
    });

    // Offline
    andThen(function() {
      $.ajaxSetup({
        headers: {
          "isOnline": false,
          "usersCount": firstCount
        }
      });
    });

    visit('/');
    visit('/find-all');

    andThen(function() {
      expect(find('#find-all ul li').length).to.equal(firstCount);
    });

    // ---------- Second round
    // Online again, count changed
    andThen(function() {
      $.ajaxSetup({
        headers: {
          "isOnline": true,
          "usersCount": secondCount
        }
      });
    });

    visit('/');
    visit('/find-all');

    andThen(function() {
      expect(find('#find-all ul li').length).to.equal(secondCount);
    });

    // Offline
    andThen(function() {
      $.ajaxSetup({
        headers: {
          "isOnline": false,
          "usersCount": secondCount
        }
      });
    });

    visit('/');
    visit('/find-all');

    andThen(function() {
      expect(find('#find-all ul li').length).to.equal(secondCount);
    });

    andThen(function() {
      done();
    });
  });

});
