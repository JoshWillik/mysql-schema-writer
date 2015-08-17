var path = require( 'path' )
var fs = require( 'fs' )

var mysql = require( 'mysql' )
var Promise = require( 'bluebird' )

var ONE_SECOND = 1000
var DEFAULT_TIMEOUT = 60 * ONE_SECOND

function openDatabaseConnection( options, shouldTryAgain ){
  return new Promise( function( resolve, reject ){
    var connection = mysql.createConnection( options )
    connection.connect( function( err ){
      if( err ){
        if( err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST' ){
          if( shouldTryAgain() ){
            setTimeout( function(){
              openDatabaseConnection( options, shouldTryAgain ).then( function( c ){
                resolve( c )
              })
            }, ONE_SECOND )
          } else {
            reject( new Error( 'MYSQL start timeout exceeded' ) )
          }
        } else {
          reject( err )
        }
      } else {
        resolve( connection )
      }
    })
  })
}

function waitThenRunSQL( schema, options ){
  if( !schema || typeof schema !== 'string' ){
    throw new Error( 'mysql-schema-writer requires either a schema string or an absolute file path to the schema file' )
  }

  if( schema[0] === '/' ){
    schema = fs.readFileSync( schema ).toString()
  }

  var timeout = options.timeout || DEFAULT_TIMEOUT
  var start = Date.now()
  function shouldTryAgain(){
    if( Date.now() - start >= timeout ){
      return false
    } else {
      return true
    }
  }

  var opts = {
    host: options.host,
    user: options.user || 'root',
    password: options.password,
    port: options.port || 3306,

    multipleStatements: true
  }

  return openDatabaseConnection( opts, shouldTryAgain ).then( function( connection ){
    var query = Promise.promisify( connection.query.bind( connection ) )
    var p = query( schema )
    connection.end()
    return p
  })
}

module.exports = waitThenRunSQL
