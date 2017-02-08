import 'babel-polyfill'

var assert = require('assert');
var blizzforum = require('../lib/index.js')

describe('query', () => {
    describe('topic', () => {
        describe('data', () => {
            it('should return locked when the topic is locked', () => {
                // https://us.battle.net/forums/en/bnet/topic/13815891462

                blizzforum.query().topic("bnet", 13815891462).data().then((data) => {
                    assert.equal(data.isLocked, true);
                });
            });
        });
    });
});