import _set from "lodash/set"
let request = require("request-promise")
let cheerio = require("cheerio")

let config = {
    server: {
        host: "https://us.battle.net",
        region: "en"
    },
    general: {
        debug: false
    }
}

function _debug (message) {
    if (config.general._debug) return console.log(message)
}

function _query_topic_request_resphandlr (response) {
    _debug(`resp statuscode ${response.statusCode}`)

    if (response.statusCode == 302) {
        throw new Error("The requested topic couldn't be found. Please check your forum_name and topic_id.")
    }

    if (response.statusCode != 200) {
        throw new Error(`The server returned HTTP status code ${response.statusCode} instead of 200, aborting`)
    }
    
    return cheerio.load(response.body)
}

function _query_topic (forumName, topicID) {
    let options = {
        uri: `${config.server.host}/forums/${config.server.region}/${forumName}/topic/${topicID}`,
        followRedirect: false,
        resolveWithFullResponse: true
    }

    _debug(`qury ${options.uri}`)

    return _query_topic_functions(request(options).then(_query_topic_request_resphandlr).then($ => {
        let pages = $("section.Topic div.Topic-container div.Topic-pagination--header a.Pagination-button--ordinal").length

        if (pages > 1) {
            let requestPromises = []

            for (let i = 2; i < pages + 1; i++) {
                let newOptions = options

                if (options.uri.indexOf("?")) {
                    newOptions.uri = options.uri.split("?")[0] + `?page=${i}`
                } else {
                    newOptions.uri = options.uri + `?page=${i}`
                }

                requestPromises.push(new Promise((resolve, reject) => {
                    _debug(`qury ${newOptions.uri}`)
                    return request(newOptions).then(_query_topic_request_resphandlr).then(resolve)
                }))
            }

            return Promise.all(requestPromises).then(values => {
                values.unshift($) // Add the first page to the result
                
                return values
            })
        } else {
            return [$]
        }
    }))
}

function _query_topic_posts (requestPromise, fields, filter) {
    return requestPromise.then(pages => {
        let posts = []

        pages.map(($, pageIndex) => {
            $("section.Topic > div.Topic-content > div.TopicPost").each((index, post) => {
                let lastEditTime, createTime, result

                $("div.TopicPost-content > div.TopicPost-body > div.TopicPost-details > div.Timestamp-details > a", post).each((i, t) => {
                    if ($(t).text().trim() == "(Edited)") {
                        lastEditTime = $(t).data("tooltip-content")
                    } else {
                        createTime = $(t).data("tooltip-content")
                    }
                })
                
                result = {
                    id: $(post).data("topic-post").id,
                    position: pageIndex * 20 + index + 1,
                    info: $(post).data("topic-post"),
                    attributes: $(post).data("topic"),
                    create_time: createTime,
                    lastEditTime: lastEditTime,
                    isBlizzardPost: $(post).hasClass("TopicPost--blizzard"),
                    url: config.server.host + $("div.TopicPost-content > div.TopicPost-body > div.TopicPost-details span.Dropdown-item", post).data("clipboard-text"),
                    content: $("div.TopicPost-content > div.TopicPost-body div.TopicPost-bodyContent", post).html()
                }

                if (fields) fields.reduce((a, b) => { a[b] = result[b]; return a }, {})

                posts.push(result)
            })
        })
        
        if (filter) return posts.filter(filter)

        return posts
    })
}

function _query_topic_functions (requestPromise) {
    return {
        data: () => {
            return requestPromise.then(pages => {
                return pages[0]("section.Topic").data("topic")
            })
        },
        posts: (fields, filter) => { return _query_topic_posts(requestPromise, fields, filter) }
    }
}

export default class blizzardForum {
    set (name, value) {
        _set(config, name, value)
    }

    query (name, value) {
        return {
            topic: _query_topic
        }
    }
}