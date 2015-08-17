# Mysql Statement Runner

Mysql Statement Runner is designed to wait until a database is available and then run commands on it.

## Install

```sh
$ npm install mysql-statement-runner
```

## Usage

```js
var runner = require( 'mysql-statement-runner' )
runner( schema, options ).then( function(){
  //SOL statement has been run
})
```

## Configuration
`schema` may be either a string or an absolute filepath to a file containing the SQL statement(s).

`options.host` is the host mysql is running on. Defaults to `localhost`.

`options.user` is the user to connect with. Defaults to `root`.

`options.password` is the password to connect with.

`options.port` is the port to connect on. Defaults to `3306`.

`options.timeout` is how many milliseconds the test runner will attempt to connect before erroring.
Defaults to `60 * 1000`
