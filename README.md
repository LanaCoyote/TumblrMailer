# TumblrMailer
NodeJS program that mails out a list of tumblr blog posts to your contacts.
Created as part of the [Fullstack Academy](http://www.fullstackacademy.com/) Foundations course.

## Requires
 * node.js
 * mandrill-api
 * tumblr.js

## Instructions
 * Rename `cfg.js.template` to `cfg.js` and set your API keys, blog information, and identity
 * Put your contacts in `friend_list.csv`, one line at a time (there's some contacts in there already!)
 * Modify `email_template.html` if you feel like it
 * Run `node tumblr-mailer.js` and watch the magic
