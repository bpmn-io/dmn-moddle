import fs from 'fs';

import { validateXML } from 'xsd-schema-validator';

import DmnModdle from '../../../lib';

const xsd = 'resources/dmn/xsd/DMN13.xsd';


describe('dmn-moddle - roundtrip', function() {

  this.timeout(30000);

  let moddle;

  beforeEach(function() {
    moddle = new DmnModdle();
  });

  function validate(fileName) {
    return async function() {
      return new Promise((resolve, reject) => {
        const file = fs.readFileSync(fileName, 'utf8');

        moddle.fromXML(file, 'dmn:Definitions', (err, definitions) => {
          if (err) {
            reject(err);
          }

          moddle.toXML(definitions, { format: true }, (err, xml) => {
            if (err) {
              reject(err);
            }

            validateXML(xml, xsd, (err, result) => {
              if (err) {
                return reject(err);
              }

              resolve(result);
            });
          });
        });
      });
    };
  }


  describe('DMN', function() {

    it('Decision', validate('test/fixtures/dmn/dmn/decision.dmn'));


    it('InputData', validate('test/fixtures/dmn/dmn/input-data.dmn'));

  });


  describe('DI', function() {

    it('Decision', validate('test/fixtures/dmn/dmndi/decision.dmn'));


    it('InputData', validate('test/fixtures/dmn/dmndi/input-data.dmn'));


    it('TextAnnotation & DI', validate('test/fixtures/dmn/dmndi/text-annotation.dmn'));


    it('with Label', validate('test/fixtures/dmn/dmndi/label.dmn'));

  });

});
