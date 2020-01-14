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


    it('InputData', async function() {

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

  });

});
