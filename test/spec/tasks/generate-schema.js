import fs from 'fs';

import parseFile from 'cmof-parser';

import expect from '../../expect';

import {
  transformDC,
  transformDI,
  transformDMN,
  transformDMNDI
} from '../../../tasks/transforms';

import {
  findProperty,
  findType
} from '../../../tasks/transforms/helper';

async function generateSchema(file) {
  const {
    options,
    source,
    transform
  } = file;

  const parsed = await parseFile(fs.readFileSync(source, 'utf8'), options);

  return transform(parsed);
}


describe('generate schema', function() {

  describe('DC', function() {

    let schema;

    beforeEach(async function() {

      // when
      schema = await generateSchema({
        source: 'resources/dmn/xmi/DMNDI13.xmi',
        transform: transformDC,
        options: {
          clean: true,
          prefixNamespaces: {
            'DC': 'dc',
            'DI': 'di'
          }
        }
      });
    });


    it('should generate schema', function() {

      // then
      expect(schema).to.exist;
    });

  });


  describe('DI', function() {

    let schema;

    beforeEach(async function() {

      // when
      schema = await generateSchema({
        source: 'resources/dmn/xmi/DMNDI13.xmi',
        transform: transformDI,
        options: {
          clean: true,
          prefixNamespaces: {
            'DC': 'dc',
            'DI': 'di'
          }
        }
      });
    });


    it('should generate schema', function() {

      // then
      expect(schema).to.exist;
    });


    it('should add di:Style#id', function() {

      // then
      const style = findProperty('Style#id', schema);

      expect(style).to.exist;

      expect(style).to.eql({
        name: 'id',
        isAttr: true,
        isId: true,
        type: 'String'
      });
    });


    it('add di:DiagramElement#id and di:DiagramElement#style', function() {

      // then
      const id = findProperty('DiagramElement#id', schema);

      expect(id).to.exist;

      expect(id).to.eql({
        name: 'id',
        isAttr: true,
        isId: true,
        type: 'String'
      });

      const style = findProperty('DiagramElement#style', schema);

      expect(style).to.exist;

      expect(style).to.eql({
        name: 'style',
        isReference: true,
        type: 'Style',
        xml: {
          serialize: 'property'
        }
      });
    });


    it('should not remove foreign prefixes', function() {

      // then
      const waypoint = findProperty('Edge#waypoint', schema);

      expect(waypoint).to.exist;

      expect(waypoint.type).to.equal('dc:Point');

      const bounds = findProperty('Shape#bounds', schema);

      expect(bounds).to.exist;

      expect(bounds.type).to.equal('dc:Bounds');
    });


    it('should rename di:Edge#wayPoints', function() {

      // then
      const waypoint = findProperty('Edge#waypoint', schema);

      expect(waypoint).to.exist;
    });

  });


  describe('DMN', function() {

    let schema;

    beforeEach(async function() {

      // when
      schema = await generateSchema({
        source: 'resources/dmn/xmi/DMN13.xmi',
        transform: transformDMN,
        options: {
          clean: true,
          prefixNamespaces: {
            'DC': 'dc',
            'DI': 'di',
            'http://www.omg.org/spec/BMM/20130801/BMM.xmi': 'bmm',
            'http://www.omg.org/spec/BPMN/20100501/BPMN20.cmof': 'bpmn',
            'https://www.omg.org/spec/DMN/20191111/DMNDI13.xmi': 'dmndi'
          }
        }
      });
    });


    it('should generate schema', function() {

      // then
      expect(schema).to.exist;
    });

  });


  describe('DMNDI', function() {

    let schema;

    beforeEach(async function() {

      // when
      schema = await generateSchema({
        source: 'resources/dmn/xmi/DMNDI13.xmi',
        transform: transformDMNDI,
        options: {
          clean: true,
          prefixNamespaces: {
            'DC': 'dc',
            'DI': 'di'
          }
        }
      });
    });


    it('should generate schema', function() {

      // then
      expect(schema).to.exist;
    });

  });

});