import expect from '../../expect';

import DmnModdle from '../../../lib';


describe('dmn-moddle - write', function() {

  let moddle;

  beforeEach(function() {
    moddle = new DmnModdle();
  });

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


  describe('dmn', function() {

    it('Definitions', async function() {

      // given
      const expected = '<dmn:definitions xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" />';

      const definitions = moddle.create('dmn:Definitions');

      // when
      const xml = await write(definitions);

      // then
      expect(xml).to.equal(expected);
    });


    it('LiteralExpression', async function() {

      // given
      const expected =
        '<dmn:decision xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" id="Decision_1" name="Foo">' +
          '<dmn:variable id="InformationItem_1" name="Bar" typeRef="integer" />' +
          '<dmn:literalExpression id="LiteralExpression_1" />' +
        '</dmn:decision>';

      const informationItem = moddle.create('dmn:InformationItem', {
        id: 'InformationItem_1',
        name: 'Bar',
        typeRef: 'integer'
      });

      const literalExpression = moddle.create('dmn:LiteralExpression', {
        id: 'LiteralExpression_1'
      });

      const decision = moddle.create('dmn:Decision', {
        id: 'Decision_1',
        literalExpression: literalExpression,
        name: 'Foo',
        variable: informationItem
      });

      // when
      const xml = await write(decision);

      // then
      expect(xml).to.equal(expected);
    });

  });


  describe('di', function() {

    it('Decision', async function() {

      // given
      const expected =
        '<dmn:definitions xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/">' +
          '<dmn:decision id="Decision_1" name="Decision_1" />' +
          '<dmndi:DMNDI>' +
            '<dmndi:DMNDiagram id="DMNDiagram_1">' +
              '<dmndi:DMNShape id="DMNShape_1" dmnElementRef="Decision_1">' +
                '<dc:Bounds height="80" width="180" x="100" y="100" />' +
              '</dmndi:DMNShape>' +
            '</dmndi:DMNDiagram>' +
          '</dmndi:DMNDI>' +
        '</dmn:definitions>';

      const definitions = moddle.create('dmn:Definitions');

      const decision = moddle.create('dmn:Decision', {
        id: 'Decision_1',
        name: 'Decision_1'
      });

      definitions.get('drgElement').push(decision);

      decision.$parent = definitions;

      const dmnDiagram = moddle.create('dmndi:DMNDiagram', {
        id: 'DMNDiagram_1',
        diagramElements: []
      });

      const dmnDI = moddle.create('dmndi:DMNDI', {
        diagrams: [ dmnDiagram ]
      });

      dmnDiagram.$parent = dmnDI;

      definitions.set('dmnDI', dmnDI);

      dmnDI.$parent = definitions;

      const bounds = moddle.create('dc:Bounds', {
        height: 80,
        width: 180,
        x: 100,
        y: 100
      });

      const shape = moddle.create('dmndi:DMNShape', {
        id: 'DMNShape_1',
        bounds,
        dmnElementRef: decision
      });

      bounds.$parent = shape;

      dmnDiagram.get('diagramElements').push(shape);

      shape.$parent = dmnDiagram.get('diagramElements');

      // when
      const xml = await write(definitions);

      // then
      expect(xml).to.equal(expected);
    });


    it('InputData', async function() {

      // given
      const expected =
        '<dmn:definitions xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/">' +
          '<dmn:inputData id="InputData_1" name="InputData_1" />' +
          '<dmndi:DMNDI>' +
            '<dmndi:DMNDiagram id="DMNDiagram_1">' +
              '<dmndi:DMNShape id="DMNShape_1" dmnElementRef="InputData_1">' +
                '<dc:Bounds height="45" width="125" x="100" y="100" />' +
              '</dmndi:DMNShape>' +
            '</dmndi:DMNDiagram>' +
          '</dmndi:DMNDI>' +
        '</dmn:definitions>';

      const definitions = moddle.create('dmn:Definitions');

      const inputData = moddle.create('dmn:InputData', {
        id: 'InputData_1',
        name: 'InputData_1'
      });

      definitions.get('drgElement').push(inputData);

      inputData.$parent = definitions;

      const dmnDiagram = moddle.create('dmndi:DMNDiagram', {
        id: 'DMNDiagram_1',
        diagramElements: []
      });

      const dmnDI = moddle.create('dmndi:DMNDI', {
        diagrams: [ dmnDiagram ]
      });

      dmnDiagram.$parent = dmnDI;

      definitions.set('dmnDI', dmnDI);

      dmnDI.$parent = definitions;

      const bounds = moddle.create('dc:Bounds', {
        height: 45,
        width: 125,
        x: 100,
        y: 100
      });

      const shape = moddle.create('dmndi:DMNShape', {
        id: 'DMNShape_1',
        bounds,
        dmnElementRef: inputData
      });

      bounds.$parent = shape;

      dmnDiagram.get('diagramElements').push(shape);

      shape.$parent = dmnDiagram.get('diagramElements');

      // when
      const xml = await write(definitions);

      // then
      expect(xml).to.equal(expected);
    });

  });

});