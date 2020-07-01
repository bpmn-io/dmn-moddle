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

    it('dmn:Definitions', async function() {

      // given
      const expected = '<dmn:definitions xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" />';

      const definitions = moddle.create('dmn:Definitions');

      // when
      const xml = await write(definitions);

      // then
      expect(xml).to.equal(expected);
    });


    it('dmn:FunctionDefinition', async function() {

      // given
      const functionDefinition = moddle.create('dmn:FunctionDefinition', {
        kind: 'FEEL',
        body: moddle.create('dmn:Context')
      });

      // when
      const xml = await write(functionDefinition);

      // then
      expect(xml).to.equal(
        '<dmn:functionDefinition xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" kind="FEEL">' +
          '<dmn:context />' +
        '</dmn:functionDefinition>'
      );
    });


    it('dmn:LiteralExpression', async function() {

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
        decisionLogic: literalExpression,
        name: 'Foo',
        variable: informationItem
      });

      // when
      const xml = await write(decision);

      // then
      expect(xml).to.equal(expected);
    });


    it('dmn:UnaryTests', async function() {

      // given
      const unaryTests = moddle.create('dmn:UnaryTests', {
        expressionLanguage: 'LANG',
        text: 'FOO'
      });

      // when
      const xml = await write(unaryTests);

      // then
      expect(xml).to.eql(
        '<dmn:unaryTests xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" expressionLanguage="LANG">' +
          '<dmn:text>FOO</dmn:text>' +
        '</dmn:unaryTests>'
      );
    });


    it('dmn:Context', async function() {

      // given
      const variable = moddle.create('dmn:InformationItem', {
        name: 'foo'
      });

      const literalExpression = moddle.create('dmn:LiteralExpression', {
        text: 'if foo = 10 then true else false'
      });

      const contextEntry = moddle.create('dmn:ContextEntry', {
        variable,
        value: literalExpression
      });

      const context = moddle.create('dmn:Context', {
        contextEntry: [ contextEntry ]
      });

      // when
      const xml = await write(context);

      // then
      expect(xml).to.eql(
        '<dmn:context xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/">' +
          '<dmn:contextEntry>' +
            '<dmn:variable name="foo" />' +
            '<dmn:literalExpression>' +
              '<dmn:text>if foo = 10 then true else false</dmn:text>' +
            '</dmn:literalExpression>' +
          '</dmn:contextEntry>' +
        '</dmn:context>'
      );
    });


    it('dmn:Invocation', async function() {

      // given
      const literalExpression1 = moddle.create('dmn:LiteralExpression', {
        id: 'LiteralExpression_1',
        text: 'FOO'
      });

      const informationItem = moddle.create('dmn:InformationItem', {
        id: 'Parameter_1',
        name: 'BOOP'
      });

      const literalExpression2 = moddle.create('dmn:LiteralExpression', {
        id: 'LiteralExpression_2',
        text: 'BAR'
      });

      const binding = moddle.create('dmn:Binding', {
        parameter: informationItem,
        bindingFormula: literalExpression2
      });

      const invocation = moddle.create('dmn:Invocation', {
        id: 'Invocation_1',
        calledFunction: literalExpression1,
        binding: [ binding ]
      });

      // when
      const xml = await write(invocation);

      // then
      // dmn:LiteralExpression should come before dmn:Binding but doesn't
      expect(xml).to.equal(
        '<dmn:invocation xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" id="Invocation_1">' +
          '<dmn:literalExpression id="LiteralExpression_1">' +
            '<dmn:text>FOO</dmn:text>' +
          '</dmn:literalExpression>' +
          '<dmn:binding>' +
            '<dmn:parameter id="Parameter_1" name="BOOP" />' +
            '<dmn:literalExpression id="LiteralExpression_2">' +
              '<dmn:text>BAR</dmn:text>' +
            '</dmn:literalExpression>' +
          '</dmn:binding>' +
        '</dmn:invocation>'
      );
    });

  });


  describe('di', function() {

    it('dmn:Decision', async function() {

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


    it('dmn:InputData', async function() {

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


  describe('biodi', function() {

    it('should write DecisionTable#annotationsWidth', async function() {

      // given
      const expected = '<dmn:decisionTable ' +
        'xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" ' +
        'xmlns:biodi="http://bpmn.io/schema/dmn/biodi/2.0" ' +
        'biodi:annotationsWidth="200" />';

      const decisionTable = moddle.create('dmn:DecisionTable');
      decisionTable.set('annotationsWidth', 200);

      // when
      const xml = await write(decisionTable);

      // then
      expect(xml).to.equal(expected);
    });


    it('should write InputClause#width', async function() {

      // given
      const expected = '<dmn:inputClause ' +
        'xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" ' +
        'xmlns:biodi="http://bpmn.io/schema/dmn/biodi/2.0" ' +
        'biodi:width="200" />';

      const inputClause = moddle.create('dmn:InputClause');
      inputClause.set('width', 200);

      // when
      const xml = await write(inputClause);

      // then
      expect(xml).to.equal(expected);
    });


    it('should write OutputClause#width', async function() {

      // given
      const expected = '<dmn:outputClause ' +
        'xmlns:dmn="https://www.omg.org/spec/DMN/20191111/MODEL/" ' +
        'xmlns:biodi="http://bpmn.io/schema/dmn/biodi/2.0" ' +
        'biodi:width="200" />';

      const outputClause = moddle.create('dmn:OutputClause');
      outputClause.set('width', 200);

      // when
      const xml = await write(outputClause);

      // then
      expect(xml).to.equal(expected);
    });

  });
});