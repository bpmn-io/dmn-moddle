'use strict';

var Helper = require('../../helper');


describe('dmn-moddle - read', function() {

  var moddle = Helper.createModdle();

  function read(xml, root, opts, callback) {
    return moddle.fromXML(xml, root, opts, callback);
  }

  function fromFile(file, root, opts, callback) {
    var contents = Helper.readFile(file);

    return read(contents, root, opts, callback);
  }


  describe('should import Decisions', function() {

    describe('dmn', function() {


      it('Decision', function(done) {

        // when
        fromFile('test/fixtures/dmn/decision.part.dmn', 'dmn:Definitions', function(err, result) {

          var expected = {
            $type: 'dmn:Decision',
            id: 'decision',
            name: 'decision-name'
          };

          // then
          expect(err).to.be.undefined;
          expect(result.drgElements[0]).to.jsonEqual(expected);

          done(err);
        });
      });

    });

    describe('camunda', function() {

      it('Extension', function(done) {

        // when
        fromFile('test/fixtures/dmn/camunda.dmn', 'dmn:Definitions', function(err, result) {

          var expected = {
            $type: 'dmn:Decision',
            id: 'decision',
            name: 'Dish',
            decisionTable: {
              $type: 'dmn:DecisionTable',
              id: 'decisionTable',
              input: [
                {
                  $type: 'dmn:InputClause',
                  id: 'input1',
                  label: 'Season',
                  inputVariable: 'currentSeason'
                }
              ]
            }
          };

          // then
          expect(err).to.be.undefined;
          expect(result.drgElements[0]).to.jsonEqual(expected);

          done(err);
        });
      });

    });


    describe('di', function() {

      it('simple', function(done) {

        // when
        fromFile('test/fixtures/dmn/simple-di.dmn', 'dmn:Definitions', function(err, result) {

          var expected = [
            {
              $type: 'dmn:BusinessKnowledgeModel',
              name: 'El menú',
              id: 'elMenu',
              extensionElements: {
                $type: 'dmn:ExtensionElements',
                values: [
                  {
                    $type: 'biodi:Bounds',
                    x: 450,
                    y: 250,
                    width: 125,
                    height: 45
                  },
                  {
                    $type:'biodi:Edge',
                    source: 'dish-decision',
                    waypoints: [
                      {
                        $type: 'biodi:Waypoint',
                        x: 450,
                        y: 250
                      },
                      {
                        $type: 'biodi:Waypoint',
                        x: 500,
                        y: 10
                      }
                    ]
                  }
                ]
              },
              authorityRequirement: [
                {
                  $type: 'dmn:AuthorityRequirement',
                  requiredAuthority: {
                    $type: 'dmn:DMNElementReference',
                    href: '#dish-decision'
                  }
                }
              ]
            },
            {
              $type: 'dmn:Decision',
              id: 'dish-decision',
              name: 'Dish Decision',
              extensionElements: {
                $type: 'dmn:ExtensionElements',
                values: [
                  {
                    $type: 'biodi:Bounds',
                    x: 150,
                    y: 10,
                    width: 180,
                    height: 80
                  }
                ]
              }
            }
          ];

          // then
          expect(err).to.be.undefined;
          expect(result.drgElements).to.jsonEqual(expected);

          done(err);
        });

      });

      it('input data', function(done) {

        // when
        fromFile('test/fixtures/dmn/input-data.dmn', 'dmn:Definitions', function(err, result) {

          var expected = [
            {
              $type: 'dmn:InputData',
              name: 'Weather in Celsius',
              id: 'temperature_id',
              extensionElements: {
                $type: 'dmn:ExtensionElements',
                values: [
                  {
                    $type: 'biodi:Bounds',
                    x: 5,
                    y: 270,
                    width: 125,
                    height: 45
                  }
                ]
              },
              variable: {
                $type: 'dmn:InformationItem',
                typeRef: 'integer',
                name: 'Weather in Celsius',
                id: 'temperature_ii'
              }
            }
          ];

          // then
          expect(err).to.be.undefined;
          expect(result.drgElements).to.jsonEqual(expected);

          done(err);
        });

      });

    });

  });

});
