var fs = require( 'fs' ) // filesystem module

function openCSV( filename ) {
    return fs.readFileSync( filename, "utf8" );
}

function fileToLines( file ) {
    return file.split( '\n' );
}

function lineToValues( csvLine ) {
    return csvLine.split( ',' );
}

function removeEmptyLines( lines ) {
    var new_lines = [];

    lines.forEach( function( line ) {
        if ( line.length > 0 ) {
            new_lines.push( line );
        }
    } );

    return new_lines;
}

// objFactory
// Given a csv line, creates a constructor with the given properties
function objFactory( csvLine ) {
    var props = lineToValues( csvLine );

    var constructor = function( vals ) {
        for ( var i=0; i < props.length; ++i ) {
            this[props[i]] = vals[i];
        }
    }

    return constructor;
}

function parse( filename ) {
    var csvLines = removeEmptyLines( fileToLines( openCSV( filename ) ) );

    // create the constructor 
    var factory = objFactory( csvLines[0] );

    // initialize our objects
    var objs = [];
    for ( var i=1; i < csvLines.length; ++i ) {
        objs.push( new factory( lineToValues( csvLines[i] ) ) );
    }

    return objs;
}

parse( "friend_list.csv" );

module.exports.parse = parse;
