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


  describe('DMN', function() {

    it('Decision', async function() {

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


    it('InputData', async function() {

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


    it('InformationRequirement', async function() {

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

  });


  describe('DI', function() {

    it('Decision & DI', async function() {

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


    it('InputData & DI', async function() {

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


    it('TextAnnotation & DI', async function() {

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


    it('with label', async function() {

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
        ]
      });
    });

  });

});
