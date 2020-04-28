<p align="center">
    <img src="https://rawgit.com/BirkhoffLee/blizzard_forum.js/master/logo.svg"
         height="120">
</p>
<p align="center">
    <!-- <a href="https://drone.birkhoff.me/BirkhoffLee/blizzard_forum.js">
        <img src="https://drone.birkhoff.me/api/badges/BirkhoffLee/blizzard_forum.js/status.svg"
             alt="Build Status" />
    </a> -->
    <a href="https://npmjs.org/package/blizzard_forum">
        <img src="https://img.shields.io/npm/v/blizzard_forum.svg"
              alt="NPM version" />
    </a>
    <!-- <a href="https://npmjs.org/package/blizzard_forum">
        <img src="https://img.shields.io/npm/dm/blizzard_forum.svg"
              alt="NPM downloads" />
    </a> -->
    <a href="https://david-dm.org/BirkhoffLee/blizzard_forum.js">
        <img src="https://david-dm.org/BirkhoffLee/blizzard_forum.js.svg"
              alt="Dependencies" />
    </a>
    <a href="https://travis-ci.org/BirkhoffLee/blizzard_forum.js">
        <img src="https://travis-ci.org/BirkhoffLee/blizzard_forum.js.svg?branch=master"
             alt="Build Status" />
    </a>
    <a href="https://codecov.io/gh/BirkhoffLee/blizzard_forum.js">
        <img src="https://codecov.io/gh/BirkhoffLee/blizzard_forum.js/branch/master/graph/badge.svg"
             alt="Coverage Status" />
    </a>
    <!-- <a href="https://coveralls.io/github/BirkhoffLee/blizzard_forum.js?branch=master">
        <img src="https://coveralls.io/repos/github/BirkhoffLee/blizzard_forum.js/badge.svg?branch=master"
             alt="Coverage Status">
    </a> -->
</p>
<p align="center">
    <sup><i>An unofficial Node.js API for Blizzard (Battle.net) Forums.</i></sup>
</p>

* **[INSTALL](#installation)** – installation instructions
* **[CONTRIBUTING](#contribute--development)** – project contribution guidelines
* **[DOCUMENTATION](#features)** – spec for the visual design of Shields badges.
* **[LICENSE](LICENSE)** – license information

# Try Now
[Run a sample online](https://goo.gl/ns39W6) to see how this API works.

# Installation
Simply download & save it to your *package.json* with:

```
$ npm install --save blizzard_forum
```

Load it with:

```js
import blizzardForum from "blizzard_forum"
let blizForum = new blizzardForum()
```

That's it. And you may want to set the host and region, which are set to `https://us.battle.net` and `en` by default:

```js
// https://tw.battle.net/forums/zh

blizForum.set("server.host", "https://tw.battle.net")
blizForum.set("server.region", "zh")
```

# Contribute & Development
See [CONTRIBUTING.md](CONTRIBUTING.md).

# Features
Functionalities of this API.

## query()
> *Returns an object of functions.*

Initalizes an query expression.

```js
blizForum.query()
```

### topic(forum_name, topic_id(, onError))
> *Returns an array of functions.*

This loads a topic with URL https://<i>&#8203;</i>us.battle.net/forums/en/<i>**forum_name**</i>/topic/<i>**topic_id**</i>.

Let's say we're loading this topic: https://us.battle.net/forums/en/bnet/topic/13815891462,
thus we should run: 

```js
.query().topic("bnet", 13815891462)
```

*onError* is a function which handles the error during the loading process.
It takes 1 argument: *error*, which contains the error information.

#### data()
> *Returns a Promise object.*

This loads the topic's information. Attributes available: *id*, *lastPosition*, *forum*, *isSticky*, *isFeatured*, *isLocked*, *isHidden*, *isFrozen*, *isSpam* and *pollId*.

```js
.query().topic(...).data().then((data) => {
    console.log(data.isLocked);
});
```

#### posts((*fields*)(, *filters*))
> *Returns a Promise object.* Loads all posts of a topic.

*fields* is an **array** that tells the API what information you want. For example, if you pass `["isBlizzardPost"]`,
the result you get will be something like `[{isBlizzardPost: true}, {isBlizzardPost: false}, ...]`.

*filters* is a **function** which tells the API that if you wish a post to be in your result. It takes 1 argument, an object
with everything about the post: *id*, *position*, *info*, *attributes*, *create_time*, *lastEditTime*, *isBlizzardPost*, *url* and *content*.

Both arguments are optional.

The example below is to print all URLs (and it will only get the URLs) of the Blizzard-staff posted contents under a topic.

```js
.query().topic(...).posts(['url'], (post) => { return post.isBlizzardPost }).then((posts) => {
    posts.forEach(post => { console.log(post.url) })
});
```
