const fs = require('fs');

const {
  fixSequence,
  parseXML,
  removePrefixes,
  removeWhitespace
} = require('./helper');

module.exports = async function(results) {
  const { elementsByType } = results;

  let model = elementsByType[ 'uml:Package' ][ 0 ];

  const prefix = model.prefix = 'dc';

  // remove properties without name
  model.types.forEach(type => {
    if (type.properties) {
      type.properties = type.properties.filter(property => !!property.name);
    }
  });

  // remove associations
  model.associations = [];

  // filter DC
  model.types = model.types.filter(({ name }) => {
    return name && name.includes('dc:');
  });

  model.enumerations = model.enumerations.filter(({ name }) => {
    return name && name.includes('dc:');
  });

  // remove dc:Style (belongs to DI, not DC)
  model.types = model.types.filter(({ name }) => {
    return name !== 'dc:Style';
  });

  model = removePrefixes(model, prefix);

  model = removeWhitespace(model);

  const file = fs.readFileSync('resources/dmn/xsd/DC.xsd', 'utf8');

  const xsd = await parseXML(file);

  model = fixSequence(model, xsd);

  // set uri
  model.uri = xsd.elementsByTagName[ 'xsd:schema' ][ 0 ].targetNamespace;

  return model;
};