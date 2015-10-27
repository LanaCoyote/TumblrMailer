var cfg = require( './cfg.js' ); // separate config info
var ejs = require( 'ejs' ); // embedded javascript template engine
var fs  = require( 'fs' ); // filesystem module
var mandrill = require( 'mandrill-api/mandrill' ); // mandrill email api

var mandrill_client = new mandrill.Mandrill( cfg.MANDRILL_API_KEY );

// Email object
// Manages storing and sending e-mail messages
function Email( subject, message, tags ) {
    this.subject = subject;
    this.message = message;
    this.tags    = tags;
};

// Email.prototype.send
// Sends the email from the given information to the given information
Email.prototype.send = function( to_name, to_email, from_name, from_email ) {
    // assemble our message object
    var msg = {
        "html":         this.message,
        "subject":      this.subject,
        "from_email":   from_email,
        "from_name":    from_name,
        "to": [ {
            "email":    to_email,
            "name":     to_name
            } ],
        "important":    false,
        "track_opens":  true,
        "auto_html":    false,
        "preserve_recipients": true,
        "merge":        false,
        "tags":         this.tags
    };
    var async = false; // use synchronous sending
    var ip_pool = "Main Pool";

    // send the message
    mandrill_client.messages.send(
        { "message": msg, "async": async, "ip_pool": ip_pool },
        function ( result ) {
            console.log( "Mandrill API sent the following message:" );
            console.log( msg );
            console.log( "Mandrill API returned the following result: " );
            console.log( result );
        }, function ( e ) {
            console.error( "Mandrill API encountered an error: " + e.name );
            console.error( "    " + e.message );
        } );
}

// EmailTemplate object
// Convenience object for creating EJS template emails
function EmailTemplate( template, data ) {
    this.temp = openEmailTemplate( template );
    this.data = data;
}

// EmailTemplate.prototype.render
// Renders an EJS template using the given template and data
EmailTemplate.prototype.render = function() {
    if ( this.temp === undefined ) {
        console.error( "Could not render e-mail template because the template file was not opened properly" );
        return undefined;
    }

    return ejs.render( this.temp, this.data );
}

// emailFromTemplate
// Convenience function that creates an Email object from an EJS template
function emailFromTemplate( subject, template, data, tags ) {
    var template = new EmailTemplate( template, data );
    
    if ( template.temp === undefined ) {
        console.error( "Could not create e-mail from template because the template file was not opened properly" );
        return undefined;
    }

    return new Email( subject, template.render(), tags );
}

// openEmailTemplate
// Opens an email template file
function openEmailTemplate( filename ) {
    try {
        return fs.readFileSync( filename, "utf8" );
    } catch ( e ) {
        console.error( "Error opening \"" + filename + "\": " + e.message );
        return undefined;
    }
}

// module exports
module.exports = Email;
module.exports.fromTemplate = emailFromTemplate;
module.exports.template = EmailTemplate;
