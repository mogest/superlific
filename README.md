# Superlific

Superlific is a word game where you must use your mouse or a touch screen to find
as many words as you can using connected letters on the board within two minutes.

Every player plays the same game at the same time.  If more than one person discovers the same word,
no-one gets points for that word.  If you alone discover a word, you'll get points; the longer
the word, the more points you get.

This game is realtime: you get to see your score and ranking as you and others submit words.

## This game is a demonstration of some newish technologies

To do lists are a pretty awful way of demonstrating a technology.  I wanted to write something
bigger so I'd run into the more meaningful problems you get when writing a proper project.

The server is written in Elixir using the Phoenix web framework, and the client is written
*twice* using two different technologies, Cycle.js and React + Redux, so you can compare them.

It's my first time using all three technologies.  If you have any comments about how I could
improve the design, I'd love to hear them.

## Getting it running

  * Install [Elixir](http://elixir-lang.org/install.html) and [Node.js](https://nodejs.org/)
  * Install Elixir dependencies with `mix deps.get`
  * Install Node.js dependencies with `npm install`
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## The two clients

You'll find the two clients in `web/static/js/cycle` and `web/static/js/react`.  Switch which
one you want to use by editing the `web/static/js/app.js` file and commenting out the appropriate line.

## Thanks

Thanks to Nick Johnstone (@Widdershin) for his mentoring with the Cycle.js client.  All bugs and nasty stuff are mine.

## Licence

MIT.  Copyright 2016 Roger Nesbitt.
