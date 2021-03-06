'use strict';

describe('browser.http.js', function () {

  var dbs = {};

  beforeEach(function (done) {
    dbs.name = testUtils.adapterUrl('http', 'test_http');
    testUtils.cleanup([dbs.name], done);
  });

  after(function (done) {
    testUtils.cleanup([dbs.name], done);
  });


  it('Create a pouch with a beforeSend hook', function (done) {
    var instantDB;
    PouchDB.destroy(dbs.name, function () {
      var beforeSendArguments = null;
      var ajax = {
        beforeSend: function () {
          beforeSendArguments = arguments;
        }
      };
      instantDB = new PouchDB(dbs.name, { ajax: ajax });
      instantDB.post({ test: 'abc' }, function (err, info) {
        beforeSendArguments.length.should.equal(2);
        var xhr = beforeSendArguments[0];
        var options = beforeSendArguments[1];
        
        xhr.should.be.an.instanceof(XMLHttpRequest);
        options.beforeSend.should.equal(ajax.beforeSend);
        done();
      });
    });
  });
  
});