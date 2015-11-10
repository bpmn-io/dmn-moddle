'use strict';

var XMLHelper = require('../../xml-helper'),
    Helper = require('../../helper');

var toXML = XMLHelper.toXML;


describe('dmn-moddle - edit', function() {

  var moddle = Helper.createModdle();

  describe('save after change', function() {

    it('should serialize changed name', function(done) {

      // given
      var fileContents = Helper.readFile('test/fixtures/dmn/decision.part.dmn');

      moddle.fromXML(fileContents, 'dmn:Definitions', function(err, result) {
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
