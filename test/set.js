import 'babel-polyfill'

var assert = require('assert');
var blizzforum = require('../lib/index.js')

describe('set', () => {
    it('should set region to en', () => {
        blizzforum.set('server.region', 'en');
    });
});