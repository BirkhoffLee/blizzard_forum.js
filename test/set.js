import 'babel-polyfill'
import * as assert from 'assert'
import blizzardForum from '../lib/index.js'

let blizForum = new blizzardForum()

blizForum.set('general.debug', false)

describe('set', () => {
    it('should set region to en', () => {
        blizForum.set('server.region', 'en')
    })
})