import 'babel-polyfill'
import * as assert from 'assert'
import blizzardForum from '../lib/index.js'

let blizForum = new blizzardForum()

describe('_debug', () => {
    it('should print a test debug info', () => {
        blizForum.__debug()("== Test debug message ==", true)
    })
})