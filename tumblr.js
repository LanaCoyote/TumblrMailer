var cfg    = require( './cfg.js' ); // external config file
var tumblr = require( 'tumblr.js' ); // tumblr API

var tumblr_client = tumblr.createClient( {
    consumer_key: cfg.TUMBLR_CONSUMER_KEY,
    consumer_secret: cfg.TUMBLR_CONSUMER_SECRET,
    token: cfg.TUMBLR_TOKEN,
    token_secret: cfg.TUMBLR_TOKEN_SECRET
} );

// daysAgoTimestamp
// Gets a timestamp (in seconds since the epoch) from days ago
function daysAgoTimestamp( days ) {
    var stamp = new Date() - new Date( Date.UTC( 1970, 0, days ) );
    return stamp / 1000;
}

// getPostList
// Gets a list of posts from tumblr and executes a callback on them
function getPostList( fn ) {
    tumblr_client.posts( cfg.TUMBLR_BLOG_URL, function( err, res ) {
        fn( res );
    } );
}

// getLatestPosts
// Gets a list of posts posted less than days ago and executes a callback
// on them.
function getLatestPosts( days, fn ) {
    getPostList( function( blogData ) {
        var cutoff = daysAgoTimestamp( days );
        var latestPosts = blogData.posts.filter( function( post ) {
            return ( Number( post.timestamp ) > cutoff );
        } );
        fn( latestPosts );
    } );
}

// module exports
module.exports.getLatestPosts = getLatestPosts;
