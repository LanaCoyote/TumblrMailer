var fs = require( 'fs' ) // filesystem module

// printError
// Prints an error message
function printError( filename, error ) {
    console.error( "Error parsing \"" + filename + "\": " + error );
}

// openCSV
// Opens a CSV file and does any initialization we may need
function openCSV( filename ) {
    try {
        return fs.readFileSync( filename, "utf8" );
    } catch( e ) {
        printError( filename, e.message );
        return undefined;
    }
}

// fileToLines
// Splits a file buffer into an array of strings by line
function fileToLines( file ) {
    return file.split( '\n' );
}

// lineToValues
// Splits a string into an array of strings separated by commas
function lineToValues( csvLine ) {
    return csvLine.split( ',' );
}

// removeEmptyLines
// Removes strings from an array with a length of 0 (not in place)
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
// Creates a constructor function from a line of comma separated values
function objFactory( csvLine ) {
    // split our line into its individual values
    var props = lineToValues( csvLine );

    // create a constructor that loops through those properties
    var constructor = function( vals ) {
        for ( var i=0; i < props.length; ++i ) {
            this[props[i]] = vals[i];
        }
    }

    return constructor;
}

// parse
// Reads through a CSV file and creates an array of objects based on its
// contents. The objects will have properties defined by the first line
function parse( filename ) {
    // parse our csv file into something usable
    var csvFile  = openCSV( filename );
    if ( csvFile === undefined ) {
        return undefined;
    }

    var csvLines = removeEmptyLines( fileToLines( csvFile ) );
    if ( csvLines.length == 0 ) {
        printError( filename, "File is empty" );
        return undefined;
    }

    // create the constructor 
    var factory = objFactory( csvLines[0] );

    // initialize our objects
    var objs = [];
    for ( var i=1; i < csvLines.length; ++i ) {
        objs.push( new factory( lineToValues( csvLines[i] ) ) );
    }

    return objs;
}

// module exports
module.exports.parse = parse;
