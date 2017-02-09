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

        describe('posts', () => {
            it('should return an array of posts info', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                blizzforum.query().topic("bnet", 14729973498).posts().then((posts) => {
                    posts.forEach(post => {
                        expect(post).to.have.property("id");
                        expect(post).to.have.property("position").and.not.equal(NaN);
                    });
                });
            });

            it('should have isBlizzardPost equals true', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                blizzforum.query().topic("bnet", 14729973498).posts().then((posts) => {
                    assert.equal(posts[0].isBlizzardPost, true);
                });
            });
        });
    });
});