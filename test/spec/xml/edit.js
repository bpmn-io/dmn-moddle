import expect from '../../expect';

import {
  createModdle,
  readFile
} from '../../helper';

import { toXML } from '../../xml-helper';


describe('dmn-moddle - edit', function() {

  const moddle = createModdle();


  describe('DMN', function() {

    it('edit Decision name', function(done) {

      // given
      const expected =
        '<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="Definitions_1" name="Foo" namespace="http://camunda.org/schema/1.0/dmn">' +
        '<decision id="Decision_1" name="Decision" />' +
        '</definitions>';

      const fileContents = readFile('test/fixtures/dmn/decision.part.dmn');

      moddle.fromXML(fileContents, 'dmn:Definitions', function(err, result) {

        result.name = 'Foo';

        // when
        toXML(result, { preamble: false }, function(err, xml) {
          expect(xml).to.equal(expected);

          done(err);
        });
      });

    });

  });

});
