import fs from 'fs';

import expect from '../../expect';

import DmnModdle from '../../../lib';


describe('dmn-moddle - edit', function() {

  let moddle;

  beforeEach(function() {
    moddle = new DmnModdle();
  });

  async function read(fileName, root = 'dmn:Definitions') {
    return new Promise((resolve, reject) => {
      const file = fs.readFileSync(fileName, 'utf8');

      moddle.fromXML(file, root, (err, definitions) => {
        if (err) {
          reject(err);
        }

        resolve(definitions);
      });
    });
  }

  function write(element, options = { preamble: false }) {
    return new Promise((resolve, reject) => {
      moddle.toXML(element, options, (err, xml) => {
        if (err) {
          reject(err);
        }

        resolve(xml);
      });
    });
  }


  describe('DMN', function() {

    it('edit Decision name', async function() {

      // given
      const expected =
        '<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="Definitions_1" name="Foo" namespace="http://camunda.org/schema/1.0/dmn">' +
          '<decision id="Decision_1" name="Decision" />' +
        '</definitions>';

      const definitions = await read('test/fixtures/dmn/dmn/decision.dmn');

      // when
      definitions.name = 'Foo';

      const xml = await write(definitions, { preamble: false });

      // then
      expect(xml).to.equal(expected);
    });

  });

});
