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

  model.prefix = 'di';

  model.xml = {
    tagAlias: 'lowerCase'
  };

  // remove properties without name
  model.types.forEach(type => {
    if (type.properties) {
      type.properties = type.properties.filter(property => !!property.name);
    }
  });

  // remove associations
  model.associations = [];

  // move dc:Style from DC to DI (belongs to DI, not DC)
  const style = model.types.find(({ name }) => {
    return name === 'dc:Style';
  });

  // filter DI
  model.types = model.types.filter(({ name }) => {
    return name && name.includes('di:');
  });

  model.types.push(style);

  model.enumerations = model.enumerations.filter(({ name }) => {
    return name && name.includes('di:');
  });

  model = removePrefixes(model);

  model = removeWhitespace(model);

  const file = fs.readFileSync('resources/dmn/xsd/DI.xsd', 'utf8');

  const xsd = await parseXML(file);

  model = fixSequence(model, xsd);

  // set uri
  model.uri = xsd.elementsByTagName[ 'xsd:schema' ][ 0 ].targetNamespace;

  return model;
};