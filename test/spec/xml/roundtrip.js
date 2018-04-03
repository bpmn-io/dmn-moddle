import {
  createModdle
} from '../../helper';

import {
  fromFile as fromXMLFile,
  toXML,
  validate
} from '../../xml-helper';


describe('dmn-moddle - roundtrip', function() {

  var moddle = createModdle();

  function fromFile(file, done) {
    fromXMLFile(moddle, file, done);
  }


  describe('should serialize valid DMN xml after read', function() {
    this.timeout(15000);

    it('example decision', function(done) {

      // given
      fromFile('test/fixtures/dmn/example.dmn', function(err, result) {

        // when
        toXML(result, { format: true }, function(err, xml) {

          validate(err, xml, done);
        });

      });

    });


    it('di', function(done) {

      // given
      fromFile('test/fixtures/dmn/example-di.dmn', function(err, result) {

        // when
        toXML(result, { format: true }, function(err, xml) {

          validate(err, xml, done);
        });

      });
    });

  });

});
