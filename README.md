<p align="center">
    <img src="https://rawgit.com/BirkhoffLee/blizzard_forum.js/master/logo.svg"
         height="120">
</p>
<p align="center">
    <a href="https://drone.birkhoff.me/BirkhoffLee/blizzard_forum.js">
        <img src="https://drone.birkhoff.me/api/badges/BirkhoffLee/blizzard_forum.js/status.svg"
             alt="Build Status">
    </a>
</p>
<p align="center">
    <sup><i>An unofficial Node.js API for Blizzard Forums.</i></sup>
</p>

# Usage
Load the API with:

```js
var blizzforum = require('../lib/index.js')
```

That's it. And you may want to set the host and region, which are set to `https://us.battle.net` and `en` by default:

```js
// https://us.battle.net/forums/en

blizzforum.set("server.host", "https://us.battle.net");
blizzforum.set("server.region", "en");
```

Follow to the *Features* part.

# Features
What can this API do? And how?

## query()
> *Returns an array of functions.*

Initalizes an query expression.
```js
blizzforum.query()
```

### topic()
> *Returns an array of functions.*

This loads a topic with URL https://<i>&#8203;</i>us.battle.net/forums/en/<i>**forum_name**</i>/topic/<i>**topic_id**</i>:
```js
.query().topic(forum_name, topic_id)
```

Let's say you want to load this topic: https://us.battle.net/forums/en/bnet/topic/13815891462,
you should run: 

```js
.query().topic("bnet", 13815891462)
```

#### data()
> *Returns a Promise object.*

This loads the topic's information. Attributes available: *id*, *lastPosition*, *forum*, *isSticky*, *isFeatured*, *isLocked*, *isHidden*, *isFrozen*, *isSpam* and *pollId*.

```js
.query().topic(...).data().then((data) => {
    console.log(data.isLocked);
});
```

