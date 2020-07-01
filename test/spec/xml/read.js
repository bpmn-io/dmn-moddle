import fs from 'fs';

import expect from '../../expect';

import DmnModdle from '../../../lib';


describe('dmn-moddle - read', function() {

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


  describe('dmn', function() {

    it('dmn:Definitions#import', async function() {

      // when
      const definitions = await read('test/fixtures/dmn/dmn/definitions-import.dmn');

      // then
      expect(definitions).to.jsonEqual({
        $type: 'dmn:Definitions',
        name: 'Definitions',
        namespace: 'http://ns',
        import: [
          {
            $type: 'dmn:Import',
            namespace: 'http://my.ns',
            name: 'myimport',
            importType: 'https://www.omg.org/spec/DMN/20191111/MODEL/'
          }
        ]
      });
    });


    it('dmn:Definitions#extensionElements', async function() {

      // when
      const definitions = await read('test/fixtures/dmn/dmn/definitions-extensionElements.dmn');

      // then
      expect(definitions).to.jsonEqual({
        $type: 'dmn:Definitions',
        name: 'Definitions',
        namespace: 'http://ns',
        extensionElements: {
          $type: 'dmn:ExtensionElements',
          values: [
            {
              $type: 'foo:prop',
              name: 'FOO',
              value: 'BAR'
            }
          ]
        }
      });
    });


    it('dmn:Decision#extensionElements', async function() {

      // when
      const decision = await read(
        'test/fixtures/dmn/dmn/decision-extensionElements.part.dmn',
        'dmn:Decision'
      );

      // then
      expect(decision).to.jsonEqual({
        $type: 'dmn:Decision',
        extensionElements: {
          $type: 'dmn:ExtensionElements',
          values: [
            {
              $type: 'foo:prop',
              name: 'FOO',
              value: 'BAR'
            }
          ]
        }
      });
    });


    it('dmn:Definitions extension attributes', async function() {

      // when
      const definitions = await read('test/fixtures/dmn/dmn/definitions-extensionAttributes.dmn');

      // then
      expect(definitions).to.jsonEqual({
        $type: 'dmn:Definitions',
        name: 'Definitions',
        namespace: 'http://ns'
      });

      expect(definitions.get('foo:bar')).to.eql('FOOBAR');
    });


    it('dmn:Decision extension attributes', async function() {

      // when
      const decision = await read(
        'test/fixtures/dmn/dmn/decision-extensionAttributes.part.dmn',
        'dmn:Decision'
      );

      // then
      expect(decision).to.jsonEqual({
        $type: 'dmn:Decision'
      });

      expect(decision.get('foo:bar')).to.eql('FOOBAR');
    });


    it('dmn:Decision', async function() {

      // given
      const expected = {
        $type: 'dmn:Decision',
        id: 'Decision_1',
        name: 'Decision'
      };

      // when
      const definitions = await read('test/fixtures/dmn/dmn/decision.dmn');

      // then
      expect(definitions.get('drgElement')[ 0 ]).to.jsonEqual(expected);
    });


    it('dmn:Decision#decisionLogic', async function() {

      // given
      const expected = {
        $type: 'dmn:Decision',
        id: 'Decision_1',
        name: 'Decision',
        decisionLogic: {
          $type: 'dmn:LiteralExpression',
          id: 'LiteralExpression_1'
        }
      };

      // when
      const decision = await read('test/fixtures/dmn/dmn/decision-decisionLogic.part.dmn', 'dmn:Decision');

      // then
      expect(decision).to.jsonEqual(expected);
    });


    it('dmn:InputData', async function() {

      // given
      const expected = {
        $type: 'dmn:InputData',
        id: 'InputData_1',
        name: 'InputData'
      };

      // when
      const definitions = await read('test/fixtures/dmn/dmn/input-data.dmn');

      // then
      expect(definitions.get('drgElement')[ 0 ]).to.jsonEqual(expected);
    });


    it('dmn:InformationRequirement', async function() {

      // given
      const expected = {
        $type: 'dmn:InformationRequirement',
        id: 'InformationRequirement_1',
        requiredInput: {
          $type: 'dmn:DMNElementReference',
          href: '#InputData_1'
        }
      };

      // when
      const definitions = await read('test/fixtures/dmn/dmn/information-requirement.dmn');

      // then
      expect(definitions.get('drgElement')[ 0 ].get('informationRequirement')[ 0 ]).to.jsonEqual(expected);
    });


    it('dmn:FunctionDefinition', async function() {

      // when
      const functionDefinition = await read(
        'test/fixtures/dmn/dmn/function-definition.part.dmn',
        'dmn:FunctionDefinition'
      );

      // then
      expect(functionDefinition).to.jsonEqual({
        $type: 'dmn:FunctionDefinition',
        kind: 'FEEL',
        formalParameter: [
          {
            $type: 'dmn:InformationItem',
            typeRef: 'string',
            name: 'ProductType'
          },
          {
            $type: 'dmn:InformationItem',
            typeRef: 'number',
            name: 'Rate'
          }
        ],
        body: {
          $type: 'dmn:Context'
        }
      });
    });


    it('dmn:List', async function() {

      // when
      const list = await read(
        'test/fixtures/dmn/dmn/list.part.dmn',
        'dmn:List'
      );

      // then
      expect(list).to.jsonEqual({
        $type: 'dmn:List',
        elements: [
          {
            $type: 'dmn:LiteralExpression',
            text: 'FOO'
          },
          {
            $type: 'dmn:LiteralExpression',
            text: 'BAR'
          }
        ]
      });
    });


    it('dmn:BusinessKnowledgeModel', async function() {

      // when
      const bkm = await read(
        'test/fixtures/dmn/dmn/business-knowledge-model.part.dmn',
        'dmn:BusinessKnowledgeModel'
      );

      // then
      expect(bkm).to.jsonEqual({
        $type: 'dmn:BusinessKnowledgeModel',
        name: 'InstallmentCalculation',
        id: 'b_InstallmentCalculation',
        variable: {
          $type: 'dmn:InformationItem',
          name: 'InstallmentCalculation'
        },
        encapsulatedLogic: {
          $type: 'dmn:FunctionDefinition',
          formalParameter: [
            {
              $type: 'dmn:InformationItem',
              typeRef: 'string',
              name: 'ProductType'
            },
            {
              $type: 'dmn:InformationItem',
              typeRef: 'number',
              name: 'Rate'
            },
            {
              $type: 'dmn:InformationItem',
              typeRef: 'number',
              name: 'Term'
            },
            {
              $type: 'dmn:InformationItem',
              typeRef: 'number',
              name: 'Amount'
            }
          ],
          body: {
            $type: 'dmn:Context'
          }
        }
      });
    });


    it('dmn:UnaryTests', async function() {

      // when
      const unaryTests = await read(
        'test/fixtures/dmn/dmn/unary-tests.part.dmn',
        'dmn:UnaryTests'
      );

      // then
      expect(unaryTests).to.jsonEqual({
        $type: 'dmn:UnaryTests',
        expressionLanguage: 'LANG',
        text: 'FOO'
      });

    });


    it('dmn:Context', async function() {

      // when
      const context = await read(
        'test/fixtures/dmn/dmn/context.part.dmn',
        'dmn:Context'
      );

      // then
      expect(context).to.jsonEqual({
        $type: 'dmn:Context',
        contextEntry: [
          {
            $type: 'dmn:ContextEntry',
            variable: {
              $type: 'dmn:InformationItem',
              typeRef: 'number',
              name: 'MonthlyFee'
            },
            value: {
              $type: 'dmn:LiteralExpression',
              text: 'if ProductType ="STANDARD LOAN" then 20.00 else if ProductType ="SPECIAL LOAN" then 25.00 else null'
            }
          },
          {
            $type: 'dmn:ContextEntry',
            variable: {
              $type: 'dmn:InformationItem',
              typeRef: 'number',
              name: 'MonthlyRepayment'
            },
            value: {
              $type: 'dmn:LiteralExpression',
              text: '(Amount *Rate/12) / (1 - (1 + Rate/12)**-Term)'
            }
          },
          {
            $type: 'dmn:ContextEntry',
            value: {
              $type: 'dmn:LiteralExpression',
              typeRef: 'number',
              text: 'MonthlyRepayment+MonthlyFee'
            }
          }
        ]
      });

    });

  });


  describe('di', function() {

    it('dmn:Decision + DI', async function() {

      // given
      const expected = {
        $type: 'dmndi:DMNDI',
        diagrams: [
          {
            $type: 'dmndi:DMNDiagram',
            diagramElements: [
              {
                $type: 'dmndi:DMNShape',
                bounds: {
                  $type: 'dc:Bounds',
                  height: 80,
                  width: 180,
                  x: 100,
                  y: 100
                }
              }
            ]
          }
        ]
      };

      // when
      const definitions = await read('test/fixtures/dmn/dmndi/decision.dmn');

      // then
      expect(definitions.get('dmnDI')).to.jsonEqual(expected);
    });


    it('dmn:InputData + DI', async function() {

      // given
      const expected = {
        $type: 'dmndi:DMNDI',
        diagrams: [
          {
            $type: 'dmndi:DMNDiagram',
            diagramElements: [
              {
                $type: 'dmndi:DMNShape',
                bounds: {
                  $type: 'dc:Bounds',
                  height: 45,
                  width: 125,
                  x: 100,
                  y: 100
                }
              }
            ]
          }
        ]
      };

      // when
      const definitions = await read('test/fixtures/dmn/dmndi/input-data.dmn');

      // then
      expect(definitions.get('dmnDI')).to.jsonEqual(expected);
    });


    it('dmn:TextAnnotation + DI', async function() {

      // when
      const definitions = await read('test/fixtures/dmn/dmndi/text-annotation.dmn');

      // then
      const artifact = definitions.get('artifact');

      expect(artifact).to.have.lengthOf(2);

      const textAnnotation = artifact[ 0 ];

      expect(textAnnotation).to.jsonEqual({
        $type: 'dmn:TextAnnotation',
        id: 'TextAnnotation_1',
        text: 'TextAnnotation_1'
      });

      const association = artifact[ 1 ];

      expect(association).to.jsonEqual({
        $type: 'dmn:Association',
        id: 'Association_1',
        sourceRef: {
          $type: 'dmn:DMNElementReference',
          href: '#Decision_1'
        },
        targetRef: {
          $type: 'dmn:DMNElementReference',
          href: '#TextAnnotation_1'
        }
      });
    });


    it('dmndi:DMNLabel', async function() {

      // when
      const definitions = await read('test/fixtures/dmn/dmndi/label.dmn');

      // then
      expect(definitions.get('dmnDI')).to.jsonEqual({
        $type: 'dmndi:DMNDI',
        diagrams: [
          {
            $type: 'dmndi:DMNDiagram',
            diagramElements: [
              {
                $type: 'dmndi:DMNShape',
                id: 'DMNShape_1',
                bounds: {
                  $type: 'dc:Bounds',
                  height: 80,
                  width: 180,
                  x: 100,
                  y: 100
                },
                label: {
                  $type: 'dmndi:DMNLabel',
                  text: {
                    $type: 'dmndi:Text',
                    text: 'Decision_1'
                  }
                }
              },
              {
                $type: 'dmndi:DMNShape',
                id: 'DMNShape_2',
                bounds: {
                  $type: 'dc:Bounds',
                  height: 45,
                  width: 125,
                  x: 127.5,
                  y: 300
                },
                label: {
                  $type: 'dmndi:DMNLabel',
                  text: {
                    $type: 'dmndi:Text',
                    text: 'InputData_1'
                  }
                }
              },
              {
                $type: 'dmndi:DMNEdge',
                id: 'DMNEdge_1',
                waypoint: [
                  {
                    $type: 'dc:Point',
                    x: 180,
                    y: 190
                  },
                  {
                    $type: 'dc:Point',
                    x: 180,
                    y: 300
                  }
                ],
                label: {
                  $type: 'dmndi:DMNLabel',
                  text: {
                    $type: 'dmndi:Text',
                    text: 'InformationRequirement_1'
                  }
                }
              }
            ]
          }
        ],
        styles: [
          {
            '$type': 'dmndi:DMNStyle',
            'id': 'SharedStyle_1',
            'fontFamily': 'arial,helvetica,sans-serif',
            'fontSize': 14,
            'fontBold': false,
            'fontItalic': false,
            'fontUnderline': false,
            'fontStrikeThrough': false
          }
        ]
      });
    });


    it('dmndi:Diagram with dmndi:Size', async function() {

      // when
      const definitions = await read('test/fixtures/dmn/dmndi/size.dmn');

      // then
      const diagram = definitions.get('dmnDI').diagrams[0];

      expect(diagram.size).to.jsonEqual({
        $type: 'dmndi:Size',
        height: 650.0,
        width: 650.0
      });
    });

  });


  describe('biodi', function() {

    it('should read biodi', async function() {

      // when
      const definitions = await read('test/fixtures/dmn/biodi/biodi.dmn');

      // then
      const decisionTable = definitions.get('drgElement')[0].decisionLogic;

      expect(decisionTable).to.have.property('annotationsWidth', 200);
      expect(decisionTable.input[0]).to.have.property('width', 150);
      expect(decisionTable.output[0]).to.have.property('width', 150);
    });
  });
});
