const fs = require('fs');

const { matchPattern } = require('min-dash');

const {
  findProperty,
  fixSequence,
  parseXML,
  removeWhitespace
} = require('./helper');

module.exports = async function(results) {
  const { elementsByType } = results;

  let model = elementsByType[ 'uml:Package' ][ 0 ];

  // remove associations
  model.associations = [];

  // remove DC and DI
  model.types = model.types.filter(({ name }) => {
    return name && !name.includes(':');
  });

  model.enumerations = model.enumerations.filter(({ name }) => {
    return name && !name.includes(':');
  });

  // fix super class of DMNStyle
  model.types.find(matchPattern({ name: 'DMNStyle' })).superClass = [ 'di:Style' ];

  // reverse order of DMNEdge superclasses
  model.types.find(matchPattern({ name: 'DMNEdge' })).superClass.reverse();

  // fix DMNLabel
  const text = findProperty('DMNLabel#text', model);

  delete text.isAttr;

  text.type = 'Text';

  model.types.push({
    name: 'Text',
    properties: [{
      name: 'text',
      isBody: true,
      type: 'String'
    }]
  });

  model = removeWhitespace(model);

  const file = fs.readFileSync('resources/dmn/xsd/DMNDI13.xsd', 'utf8');

  const xsd = await parseXML(file);

  model = fixSequence(model, xsd);

  // set uri
  model.uri = xsd.elementsByTagName[ 'xsd:schema' ][ 0 ].targetNamespace;

  return model;
};