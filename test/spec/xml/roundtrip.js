import fs from 'fs';

import { validateXML } from 'xsd-schema-validator';

import DmnModdle from '../../../lib';

import { expect } from 'chai';

const xsd = 'resources/dmn/xsd/DMN13.xsd';


describe('dmn-moddle - roundtrip', function() {

  this.timeout(30000);


  describe('DMN', function() {

    it('Decision', roundtrip('test/fixtures/dmn/dmn/decision.dmn'));


    it('InputData', roundtrip('test/fixtures/dmn/dmn/input-data.dmn'));

  });


  describe('DI', function() {

    it('Decision', roundtrip('test/fixtures/dmn/dmndi/decision.dmn'));


    it('InputData', roundtrip('test/fixtures/dmn/dmndi/input-data.dmn'));


    it('TextAnnotation & DI', roundtrip('test/fixtures/dmn/dmndi/text-annotation.dmn'));


    it('with Label', roundtrip('test/fixtures/dmn/dmndi/label.dmn'));


    it('with Size', roundtrip('test/fixtures/dmn/dmndi/size.dmn'));

  });

});


// helpers ////////////////

function roundtrip(fileName) {
  return async function() {

    const moddle = new DmnModdle();

    return new Promise((resolve, reject) => {
      const file = fs.readFileSync(fileName, 'utf8');

      moddle.fromXML(file, 'dmn:Definitions', (err, definitions, context) => {
        if (err) {
          return reject(err);
        }

        try {
          expect(context.warnings).to.be.empty;
        } catch (err) {
          return reject(err);
        }

        return moddle.toXML(definitions, { format: true }, (err, xml) => {
          if (err) {
            return reject(err);
          }

          validateXML(xml, xsd, (err, result) => {
            if (err) {
              return reject(err);
            }

            return resolve(result);
          });
        });
      });
    });
  };
}