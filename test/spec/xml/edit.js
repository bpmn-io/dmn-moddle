import fs from 'fs';

import expect from '../../expect';

import DmnModdle from '../../../lib';

import { validateXML } from 'xsd-schema-validator';

const xsd = 'resources/dmn/xsd/DMN13.xsd';

describe('dmn-moddle - edit', function() {

  let moddle;

  beforeEach(function() {
    moddle = new DmnModdle();
  });

  function readFromFile(fileName, root = 'dmn:Definitions') {
    const file = fs.readFileSync(fileName, 'utf8');

    return moddle.fromXML(file, root);
  }

  function write(element, options = { preamble: false }) {
    return moddle.toXML(element, options);
  }

  function validate(xml) {

    return new Promise((resolve, reject) => {
      validateXML(xml, xsd, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });

  }


  describe('dmn', function() {

    it('should edit dmn:Decision name', async function() {

      // given
      const expected =
        '<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" id="Definitions_1" name="Foo" namespace="http://camunda.org/schema/1.0/dmn">' +
          '<decision id="Decision_1" name="Decision" />' +
        '</definitions>';

      const { rootElement: definitions } = await readFromFile('test/fixtures/dmn/dmn/decision.dmn');

      // when
      definitions.name = 'Foo';

      const { xml } = await write(definitions, { preamble: false });

      // then
      expect(xml).to.equal(expected);
    });


    it('should create dmn:ItemDefinition', async function() {

      const def_1 = moddle.create('dmn:ItemDefinition', {
        typeLanguage: 'FEEL',
        name: 'def_1',
        typeRef: 'xsd:string',
        allowedValues: moddle.create('dmn:UnaryTests', {
          text: 'a, b'
        })
      });

      const def_2_component = moddle.create('dmn:ItemDefinition', {
        typeLanguage: 'FEEL',
        name: 'def_2_component',
        typeRef: 'xsd:string',
        allowedValues: moddle.create('dmn:UnaryTests', {
          text: '[0..5]'
        })
      });

      const def_2 = moddle.create('dmn:ItemDefinition', {
        name: 'def_2',
        itemComponent: [
          def_2_component
        ],
        isCollection: true
      });

      const def_3 = moddle.create('dmn:ItemDefinition', {
        name: 'def_3',
        functionItem: moddle.create('dmn:FunctionItem', {
          parameters: [
            moddle.create('dmn:InformationItem', {
              typeRef: 'string',
              name: 'ProductType'
            }),
            moddle.create('dmn:InformationItem', {
              typeRef: 'number',
              name: 'Rate'
            })
          ],
          outputTypeRef: 'xsi:string'
        })
      });

      const definitions = moddle.create('dmn:Definitions', {
        name: 'foo',
        namespace: 'http://foo',
        itemDefinition: [
          def_1,
          def_2,
          def_3
        ]
      });

      // when
      const { xml } = await write(definitions);

      // then
      await validate(xml);
    });

  });

});
