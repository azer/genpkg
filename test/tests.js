var genpkg = require('../lib/genpkg'),
    logging = require('../lib/logging'),
    assert = require('assert'),
    fs = require('fs');

function test_manifest(callback){
  var content = 'The quick brown fox jumps over the lazy dog',
      uri = 'http://quux.qux/foo.js';

  var manifest = genpkg.manifest({
    'uri':uri,
    'content':content
  });

  assert.equal(manifest.name, 'foo');
  assert.equal(manifest.sha1, '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12');
  assert.equal(manifest.uri, uri);

  assert.equal(manifest.uri, uri);

  callback();
}

function test_fetch_http(callback){
  genpkg.fetch('http://kodfabrik.com/helloworld.txt', function(error, body){
    if(error){
      return callback(error);
    }

    assert.equal(body, 'hello world\n');
    callback();
  });
}

function test_fetch_local(callback){
  var filename = 'helloworld.txt',
      content = 'hello world';

  fs.writeFile(filename, content, function(error) {
    if(error) {
      logging.error('Failed to write /tmp/helloworld.txt');
      return callback(error);
    }
    
    genpkg.fetch(filename, function(error, body){
      if(error){
        return callback(error);
      }

      assert.equal(body, content);
      callback();
    });

  });
}

function test_genpkg(callback){
  genpkg.genpkg({ uri:'http://kodfabrik.com/helloworld.js'}, function(error, result){
    assert.equal(result.content, 'console.log(\'hello world\');\n');
    assert.equal(result.manifest.name, 'helloworld');
    assert.equal(result.manifest.main, './lib/helloworld');
    callback();
  });
}

function test_save(callback){
  callback(new Error('not implemented'));
}

function test_sha1(callback){
  assert.equal(genpkg.sha1('The quick brown fox jumps over the lazy dog'), '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12');
  callback();
}

function test_update(callback){
  callback(new Error('not implemented'));
}


module.exports = {
  'test_manifest':test_manifest,
  'test_fetch_http':test_fetch_http,
  'test_fetch_local':test_fetch_local,
  'test_genpkg':test_genpkg,
  'test_save':test_save,
  'test_sha1':test_sha1,
  'test_update':test_update
}
