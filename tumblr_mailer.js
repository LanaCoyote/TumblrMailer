var csv    = require( './csv' ); // csv module
var email  = require( './email' ); // email module
var tumblr = require( './tumblr' ); // tumblr module

var blog_url = "http://davidreevecodes.tumblr.com/";
var contact_list = csv.parse( "friend_list.csv" );
console.log( "You have " + contact_list.length + " contacts" );

function fullName( contact ) {
    return contact.firstName + " " + contact.lastName;
}

tumblr.getLatestPosts( 7, function( latest_posts ) {
    console.log( "There's " + latest_posts.length + " latest posts" );

    // loop through our contact list
    contact_list.forEach( function( contact ) {
        console.log( "Sending an e-mail to " + fullName( contact ) + " (" + contact.emailAddress + ")..." );

        // create an email for this contact
        var template_data = {
            "firstName": contact.firstName,
            "numMonthsSinceContact": contact.numMonthsSinceContact,
            "blogUrl": blog_url,
            "latestPosts": latest_posts
        };
        var new_email = email.fromTemplate(
            "Check out my latest blog posts!",
            "email_template.html",
            template_data,
            ["Fullstack_Tumblrmailer_Workshop"]
        );

        // send the email!
        new_email.send( fullName( contact ), contact.emailAddress,
            "David Reeve", "david.thomas.reeve@gmail.com" );
    } );
} );
