import 'babel-polyfill'
import * as assert from 'assert'
import blizzardForum from '../lib/index.js'

let blizForum = new blizzardForum()

// blizForum.set("general.debug", "true")

describe('query', () => {
    describe('topic', () => {
        describe('data', () => {
            it('should return locked when the topic is locked', () => {
                // https://us.battle.net/forums/en/bnet/topic/13815891462

                blizForum.query().topic("bnet", 13815891462).data().then((data) => {
                    expect(data.isLocked).to.be.true
                })
            })
        })

        describe('posts', () => {
            it('should return an array of posts info', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                blizForum.query().topic("bnet", 14729973498).posts().then((posts) => {
                    posts.forEach(post => {
                        expect(post).to.have.property("id")
                        expect(post).to.have.property("position").and.not.equal(NaN)
                    })
                })
            })

            it('should have isBlizzardPost equal true', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                blizForum.query().topic("bnet", 14729973498).posts().then((posts) => {
                    expect(post[0].isBlizzardPost).to.be.true
                })
            })

            it('should only return posts which its property isBlizzardPost equals true', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                blizForum.query().topic("bnet", 14729973498).posts(null, (post) => { return post.isBlizzardPost }).then((posts) => {
                    posts.map((post) => expect(post.isBlizzardPost).to.be.true)
                })
            })

            it('should only return post ids', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                blizForum.query().topic("bnet", 14729973498).posts(['id']).then((posts) => {
                    expect(post.length).to.equal(1)
                    expect(post.id).to.be.an("int")
                })
            })

            it('should return only the post ids for which its property isBlizzardPost equals true', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                blizForum.query().topic("bnet", 14729973498).posts(['id'], (post) => { return post.isBlizzardPost }).then((posts) => {
                    expect(post.length).to.equal(1)
                    expect(post.id).to.be.an("int")
                    posts.map((post) => expect(post.isBlizzardPost).to.be.true)
                })
            })
        })
    })
})