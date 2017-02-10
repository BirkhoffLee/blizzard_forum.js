import 'babel-polyfill'
import {expect, assert} from 'chai'
import blizzardForum from '../lib/index.js'

let blizForum = new blizzardForum()

blizForum.set('general.debug', false)

describe('query', () => {
    describe('topic', function () {
        this.timeout(15000);

        describe('data', () => {
            it('should return locked when the topic is locked', () => {
                // https://us.battle.net/forums/en/bnet/topic/13815891462

                return blizForum.query().topic("bnet", 13815891462).data().then(data => {
                    expect(data.isLocked).to.be.true
                })
            })
        })

        describe('topic', () => {
            it('should throw an error says the topic doesn\'t exist', () => {
                // https://us.battle.net/forums/en/bnet/topic/this_is_a_page_which_doesnt_exist

                return blizForum.query().topic("bnet", "this_is_a_page_which_doesnt_exist", error => {
                    return assert(error.name === "TopicNotFoundError", "should be an TopicNotFoundError")
                })
            })

            it('should redirect to an another page since the page doesn\'t exist', () => {
                // https://us.battle.net/forums/en/this_place_doesnt_exist/topic/abcde

                return blizForum.query().topic("this_place_doesnt_exist", "abcde", error => {
                    return assert(error.name === "StatusCodeError", "should be an StatusCodeError")
                })
            })
        })

        describe('posts', () => {
            it('should return an array of posts info', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                return blizForum.query().topic("bnet", 14729973498).posts().then(posts => {
                    posts.forEach(post => {
                        expect(post).to.have.property("id")
                        expect(post).to.have.property("position").and.not.equal(NaN)
                    })
                })
            })

            it('should have isBlizzardPost equal true', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                return blizForum.query().topic("bnet", 14729973498).posts().then(posts => {
                    expect(posts[0].isBlizzardPost).to.be.true
                })
            })

            it('should only return posts which its property isBlizzardPost equals true', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                return blizForum.query().topic("bnet", 14729973498).posts(null, post => {
                    return post.isBlizzardPost
                }).then(posts => {
                    posts.map(post => {
                        expect(post.isBlizzardPost).to.be.true
                    })
                })
            })

            it('should return only post ids', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                return blizForum.query().topic("bnet", 14729973498).posts(['id']).then(posts => {
                    posts.map(post => {
                        expect(Object.keys(post).length).to.equal(1)
                        expect(post.id).to.be.a("number")
                    })
                })
            })

            it('should return the post ids and if it\'s posted by Blizzard staff for those posted by Blizzard staff', () => {
                // https://us.battle.net/forums/en/bnet/topic/14729973498

                return blizForum.query().topic("bnet", 14729973498).posts(['id', 'isBlizzardPost'], post => {
                    return post.isBlizzardPost
                }).then(posts => {
                    posts.map(post => {
                        expect(Object.keys(post).length).to.equal(2)
                        expect(post.id).to.be.a("number")
                        expect(post.isBlizzardPost).to.be.true
                    })
                })
            })
        })
    })
})