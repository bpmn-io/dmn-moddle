const fs = require('node:fs');

const {
  findProperty,
  findType,
  fixSequence,
  parseXML,
  removeProperty,
  removeWhitespace
} = require('./helper.cjs');

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
  findType('DMNStyle', model).superClass = [ 'di:Style' ];

  // reverse order of DMNEdge superclasses
  findType('DMNEdge', model).superClass.reverse();

  // fix DMNLabel
  const text = findProperty('DMNLabel#text', model);

  delete text.isAttr;

  text.type = 'Text';

  model.types.push({
    name: 'Text',
    properties: [ {
      name: 'text',
      isBody: true,
      type: 'String'
    } ]
  });

  removeProperty('DMNStyle#id', model);

  // fix dmndi:DMNDiagram#sharedStyle and dmndi:DMNDiagramElement#sharedStyle
  // by redefining di:DiagramElement#sharedStyle
  findProperty('DMNDiagram#sharedStyle', model).redefines = 'di:DiagramElement#sharedStyle';
  findProperty('DMNDiagramElement#sharedStyle', model).redefines = 'di:DiagramElement#sharedStyle';

  // fix dmndi:DMNDiagram#dmnElementRef and dmndi:DMNDiagramElement#dmnElementRef type prefix
  findProperty('DMNDiagram#dmnElementRef', model).type = 'dmn:DMNElement';
  findProperty('DMNDiagramElement#dmnElementRef', model).type = 'dmn:DMNElement';

  // add dmndi:Size and change dmndi:DMNDiagram#size type to that
  model.types.push({
    name: 'Size',
    superClass: [
      'dc:Dimension'
    ]
  });
  findProperty('DMNDiagram#size', model).type = 'Size';

  model = removeWhitespace(model);

  const file = fs.readFileSync('resources/dmn/xsd/DMNDI13.xsd', 'utf8');

  const xsd = await parseXML(file);

  model = fixSequence(model, xsd);

  // set uri
  model.uri = xsd.elementsByTagName[ 'xsd:schema' ][ 0 ].targetNamespace;

  return model;
};
