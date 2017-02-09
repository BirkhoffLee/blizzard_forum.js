import 'babel-polyfill'
import * as assert from 'assert'
import blizzardForum from '../lib/index.js'

let blizForum = new blizzardForum()

describe('set', () => {
    it('should set region to en', () => {
        blizForum.set('server.region', 'en')
    })
})