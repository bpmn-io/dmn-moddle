import expect from '../../expect';

import {
  createModdle,
  readFile
} from '../../helper';

import {
  toXML
} from '../../xml-helper';


describe('dmn-moddle - edit', function() {

  var moddle = createModdle();

  describe('save after change', function() {

    it('should serialize changed name', function(done) {

      // given
      var fileContents = readFile('test/fixtures/dmn/decision.part.dmn');

      moddle.fromXML(fileContents, 'dmn:Definitions', function(err, result) {

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
