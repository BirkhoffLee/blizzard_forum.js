import _set from "lodash/set"

let request = require("request-promise");
let cheerio = require("cheerio");

let config = {
    server: {
        host: "https://us.battle.net",
        region: "en"
    },
    general: {
        debug: true
    }
}

// -- private functions

function debug (message) {
    if (config.general.debug) return console.log(message);
}

function query_topic (forumName, topicID) {
    let options = {
        uri: `${config.server.host}/forums/${config.server.region}/${forumName}/topic/${topicID}`,
        transform: cheerio.load
    };

    debug(`querying ${options.uri}`);

    return query_topic_functions(request(options).catch(debug));
}

function query_topic_functions (requestPromise) {
    return {
        data: () => {
            return requestPromise.then(($) => {
                result = $("section.Topic").data("topic");
                // console.log($("section.Topic > div.Topic-content > div.TopicPost").html());
            });
        }
    }
}

// -- exported functions

export function set (name, value) {
    _set(config, name, value);
}

export function query (name, value) {
    return {
        topic: query_topic
    };
}