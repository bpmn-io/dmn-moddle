const fs = require('node:fs');

const {
  findProperty,
  findType,
  fixSequence,
  parseXML,
  removePrefixes,
  removeWhitespace
} = require('./helper.cjs');

module.exports = async function(results) {
  const { elementsByType } = results;

  let model = elementsByType[ 'uml:Package' ][ 0 ];

  model.name = 'DI';

  const prefix = model.prefix = 'di';

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
  const style = findType('dc:Style', model);

  style.name = 'di:Style';

  // add di:Style#id (cf. https://github.com/omg-dmn-taskforce/omg-dmn-spec/issues/10)
  if (!style.properties) {
    style.properties = [];
  }

  style.properties.push({
    name: 'id',
    isAttr: true,
    isId: true,
    type: 'String'
  });

  // add di:DiagramElement#id and di:DiagramElement#style
  // (cf. https://github.com/omg-dmn-taskforce/omg-dmn-spec/issues/9)
  // sharedStyle is not added because it is already redefined in DMNDI
  const diagramElement = findType('di:DiagramElement', model);

  if (!diagramElement.properties) {
    diagramElement.properties = [];
  }

  diagramElement.properties.push({
    name: 'extension',
    type: 'Extension'
  },
  {
    name: 'id',
    isAttr: true,
    isId: true,
    type: 'String'
  }, {
    name: 'style',
    isReference: true,
    type: 'Style',
    xml: {
      serialize: 'property'
    }
  }, {
    name: 'sharedStyle',
    isReference: true,
    isVirtual: true,
    type: 'Style'
  });

  // add superclass di:DiagramElement to di:Edge and di:Shape
  findType('di:Edge', model).superClass = [ 'di:DiagramElement' ];
  findType('di:Shape', model).superClass = [ 'di:DiagramElement' ];

  // rename di:Edge#wayPoints as specified in XSD
  // (cf. https://github.com/omg-dmn-taskforce/omg-dmn-spec/issues/11)
  const wayPoints = findProperty('di:Edge#wayPoints', model);

  wayPoints.name = 'waypoint';

  wayPoints.xml = {
    serialize: 'property'
  };

  // filter DI
  model.types = model.types.filter(({ name }) => {
    return name && name.includes('di:');
  });

  model.types.push({
    name: 'Extension',
    properties: [
      {
        name: 'values',
        isMany: true,
        type: 'Element'
      }
    ]
  });

  model.enumerations = model.enumerations.filter(({ name }) => {
    return name && name.includes('di:');
  });

  model = removePrefixes(model, prefix);

  model = removeWhitespace(model);

  const file = fs.readFileSync('resources/dmn/xsd/DI.xsd', 'utf8');

  const xsd = await parseXML(file);

  model = fixSequence(model, xsd);

  // set uri
  model.uri = xsd.elementsByTagName[ 'xsd:schema' ][ 0 ].targetNamespace;

  return model;
};
