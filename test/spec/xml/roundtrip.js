import fs from 'node:fs';
import process from 'node:process';

import { validateXML } from 'xsd-schema-validator';

import DmnModdle from '../../../lib/index.js';

import { expect } from 'chai';

const xsd = 'resources/dmn/xsd/DMN13.xsd';


describe('dmn-moddle - roundtrip', function() {

  this.timeout(30000);


  describe('dmn', function() {

    it('dmn:Decision', roundtrip('test/fixtures/dmn/dmn/decision.dmn'));


    it('dmn:InputData', roundtrip('test/fixtures/dmn/dmn/input-data.dmn'));


    it('dmn:Context', roundtrip('test/fixtures/dmn/dmn/context.dmn'));


    it('dmn:Import', roundtrip('test/fixtures/dmn/dmn/definitions-import.dmn'));

  });


  describe('di', function() {

    it('dmn:Decision + DI', roundtrip('test/fixtures/dmn/dmndi/decision.dmn'));


    it('dmn:InputData + DI', roundtrip('test/fixtures/dmn/dmndi/input-data.dmn'));


    it('dmn:TextAnnotation + DI', roundtrip('test/fixtures/dmn/dmndi/text-annotation.dmn'));


    it('with Label', roundtrip('test/fixtures/dmn/dmndi/label.dmn'));


    it('with Size', roundtrip('test/fixtures/dmn/dmndi/size.dmn'));


    it('with di:Extension', roundtrip('test/fixtures/dmn/dmndi/extension.dmn'));

  });


  describe('biodi', function() {

    it('biodi', roundtrip('test/fixtures/dmn/biodi/biodi.dmn'));

  });
});


// helpers ////////////////

function roundtrip(fileName) {
  return async function() {
    const moddle = new DmnModdle();

    const file = fs.readFileSync(fileName, 'utf8');

    const {
      rootElement: definitions,
      warnings
    } = await moddle.fromXML(file, 'dmn:Definitions');

    if (process.env.VERBOSE && warnings.length > 0) {
      console.log('import warnings', warnings);
    }

    expect(warnings).to.be.empty;

    const { xml } = await moddle.toXML(definitions, { format: true });

    await validateXML(xml, xsd);
  };
}
