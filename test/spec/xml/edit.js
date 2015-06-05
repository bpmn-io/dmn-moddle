'use strict';

var XMLHelper = require('../../xml-helper'),
    Helper = require('../../helper');

var toXML = XMLHelper.toXML;


describe('dmn-moddle - edit', function() {

  var moddle = Helper.createModdle();

  function fromFile(file, done) {
    XMLHelper.fromFile(moddle, file, done);
  }


  describe('save after change', function() {

    it('should serialize changed name', function(done) {

      // given
      fromFile('test/fixtures/dmn/item-definition.part.dmn', function(err, result) {

        if (err) {
          return done(err);
        }

        result.name = 'FOOBAR';

        // when
        toXML(result, { format: true }, function(err, xml) {
          expect(xml).to.contain('name="FOOBAR"');

          done(err);
        });
      });

    });

  });

});
