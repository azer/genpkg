var request = require('request'),
    crypto = require('crypto'),
    logging = require('./logging'),
    fs = require('fs'),
    path = require('path');

function fetch(uri, callback){
  logging.trace('fetching %s', uri);

  if(!/\w+\:\/\//.test(uri)){
    logging.trace('Reading '+uri);
    fs.readFile(uri, callback);
    return;
  }

  logging.trace('sending request to '+uri);
  request(uri, function(error, response, body){
    if(error){
      return callback(error);
    }

    if(response.statusCode == 200){
      callback(error, body);
    }

  });
}

function manifest(options){
  return {
    'name':path.basename(options.uri, '.js'),
    'sha1':sha1(options.content),
    'author':options.author,
    'description':options.description,
    'version':options.version,
    'uri':options.uri,
    'directories':{ 'lib':'./lib' },
    'main':'./lib/'+path.basename(options.uri,'.js')
  };
}

function genpkg(options, callback){
  logging.trace('generating package for '+options.uri);
  fetch(options.uri, function(error, content){
    if(error){
      return callback(error);
    }

    callback(undefined, {
      'manifest':manifest({ 'uri':options.uri, 'content':content }),
      'content':content
    });

  });
}

function sha1(data){
  var shasum = crypto.createHash('sha1');
  shasum.update(data);
  return shasum.digest('hex');
}

module.exports = {
  'fetch':fetch,
  'genpkg':genpkg,
  'manifest':manifest,
  'sha1':sha1
};
