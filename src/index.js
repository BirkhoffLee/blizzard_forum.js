import _set from "lodash/set"
import _pick from "lodash/pick"
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

function _debug (message, force) {
    if (config.general.debug || force) return console.log(message)
}

function TopicNotFoundError (message) {
  this.name = 'TopicNotFoundError';
  this.message = message;
  this.stack = (new Error()).stack;
}

TopicNotFoundError.prototype = Object.create(Error.prototype);
TopicNotFoundError.prototype.constructor = TopicNotFoundError;

function StatusCodeError (message) {
  this.name = 'StatusCodeError';
  this.message = message;
  this.stack = (new Error()).stack;
}

StatusCodeError.prototype = Object.create(Error.prototype);
StatusCodeError.prototype.constructor = StatusCodeError;

function _query_topic_request_errhandlr (error) {
    if (error.name === "StatusCodeError") {
        if (error.statusCode === 404) {
            throw new TopicNotFoundError("The requested topic couldn't be found. Please check your forum_name and topic_id.")
        } else {
            throw new StatusCodeError(`The server returned HTTP status code ${error.statusCode} instead of 200, aborting`)
        }
    } else { throw error }
}

function _query_topic_request_resphandlr (response) {
    _debug(`resp statuscode ${response.statusCode}`)

    return cheerio.load(response.body)
}

function _query_topic_return_all_pages_cheerio_obj (options) {
    return ($) => {
        let pages = $("section.Topic div.Topic-container div.Topic-pagination--header a.Pagination-button--ordinal").length

        if (pages > 1) {
            let requestPromises = []

            for (let i = 2; i < pages + 1; i++) {
                let newOptions = options

                newOptions.uri = options.uri.split("?")[0] + `?page=${i}`

                requestPromises.push(new Promise((resolve, reject) => {
                    _debug(`qury ${newOptions.uri}`)
                    return request(newOptions).then(_query_topic_request_resphandlr).then(resolve)
                }))
            }

            return Promise.all(requestPromises).then(values => {
                values.unshift($) // Adds the first page to the result
                
                return values
            })
        } else {
            return [$]
        }
    }
}

function _query_topic (forumName, topicID, errHandlr) {
    topicID = parseInt(topicID)

    let options = {
        uri: `${config.server.host}/forums/${config.server.region}/${forumName}/topic/${topicID}`,
        followRedirect: false,
        resolveWithFullResponse: true
    }

    _debug(`qury ${options.uri}`)

    return _query_topic_functions(
        request(options)
            .catch(_query_topic_request_errhandlr)
            .then(_query_topic_request_resphandlr, _query_topic_request_errhandlr)
            .then(_query_topic_return_all_pages_cheerio_obj(options), errHandlr)
    )
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
                    id: parseInt($(post).data("topic-post").id),
                    position: pageIndex * 20 + index + 1,
                    info: $(post).data("topic-post"),
                    attributes: $(post).data("topic"),
                    create_time: createTime,
                    lastEditTime: lastEditTime,
                    isBlizzardPost: $(post).hasClass("TopicPost--blizzard"),
                    url: config.server.host + $("div.TopicPost-content > div.TopicPost-body > div.TopicPost-details span.Dropdown-item", post).data("clipboard-text"),
                    content: $("div.TopicPost-content > div.TopicPost-body div.TopicPost-bodyContent", post).html()
                }

                if (typeof filter == "function") {
                    _debug("filtering")
                    if (!filter(result)) {
                        return
                    }
                }

                if (fields instanceof Array) {
                    _debug("field-picking")
                    result = _pick(result, fields)
                }

                posts.push(result)
            })
        })

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

    query () {
        return {
            topic: _query_topic
        }
    }

    __debug () {
        return _debug;
    }
}
