import _set from "lodash/set"
import {_debug} from "./internal_func"
import _query_topic from "./query.topic"

global.config = {
    server: {
        host: "https://us.battle.net",
        region: "en"
    },
    general: {
        debug: false
    }
}

export default class blizzardForum {
    set (name, value) {
        _set(global.config, name, value)
    }

    query () {
        return {
            topic: _query_topic
        }
    }

    __debug () {
        return _debug;
    }
}
