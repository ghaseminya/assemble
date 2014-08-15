/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');


describe('config process', function () {
  var site = null;
  beforeEach(function() {
    site = assemble.create();
  });

  describe('.process()', function () {
    it('should resolve template strings in config values', function () {
      var store = site.process({a: '<%= b %>', b: 'c'});
      store.a.should.equal('c')
    });

    it('should resolve es6 template strings in config values', function () {
      var store = site.process({a: '${b}', b: 'c'});
      store.a.should.equal('c')
    });

    it('should recursively resolve template strings.', function () {
      var store = site.process({
        a: '${b}',
        b: '${c}',
        c: '${d}',
        d: '${e.f.g}',
        e: {f:{g:'h'}}});
      store.a.should.equal('h');
    });

    describe('when functions are defined on the config', function() {
      it('should used them on config templates', function() {
        site.data({
          upper: function (str) {
            return str.toUpperCase();
          }
        });

        site.data({fez: 'bang', pop: 'boom-pow!'});
        site.data({whistle: '<%= upper(fez) %>-<%= upper(pop) %>'});
        site.get('data.whistle').should.equal('<%= upper(fez) %>-<%= upper(pop) %>');

        var a = site.process(site.get('data.whistle'), site.get('data'));
        a.should.equal('BANG-BOOM-POW!');

        var b = site.process(site.get('data'), site.get('data'));
        b.whistle.should.equal('BANG-BOOM-POW!');
      });
    });
  });
});