'use strict';

var Helper = require('../../helper'),
    XMLHelper = require('../../xml-helper');

var toXML = XMLHelper.toXML,
    validate = XMLHelper.validate;


describe('dmn-moddle - roundtrip', function() {

  var moddle = Helper.createModdle();

  function fromFile(file, done) {
    XMLHelper.fromFile(moddle, file, done);
  }


  describe('should serialize valid DMN xml after read', function() {
    this.timeout(15000);

    it('example decision', function(done) {

      // given
      fromFile('test/fixtures/dmn/example.dmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          validate(err, xml, done);
        });

      });

    });


    it('di', function(done) {

      // given
      fromFile('test/fixtures/dmn/example-di.dmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          validate(err, xml, done);
        });

      });
    });

  });

});
