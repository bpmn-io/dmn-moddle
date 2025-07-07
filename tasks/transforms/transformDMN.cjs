const fs = require('node:fs');

const { matchPattern } = require('min-dash');

const {
  findChildren,
  findProperty,
  findType,
  fixSequence,
  orderProperties,
  parseXML,
  removeProperties,
  removeWhitespace
} = require('./helper.cjs');

module.exports = async function(results) {

  const xsdFile = fs.readFileSync('resources/dmn/xsd/DMN13.xsd', 'utf8');

  const dmnXSD = await parseXML(xsdFile);

  const { elementsByType } = results;

  let model = elementsByType[ 'uml:Package' ][ 0 ];

  model.xml = {
    tagAlias: 'lowerCase'
  };

  // remove types without properties
  model.types = model.types.filter(({ properties }) => properties);

  // remove properties without name
  model.types.forEach(type => {
    if (type.properties) {
      type.properties = type.properties.filter(({ name }) => name);
    }
  });

  // remove associations
  model.associations = [];

  // remove DC and DI
  model.types = model.types.filter(({ name }) => {
    return name && !name.includes(':');
  });

  model.enumerations = model.enumerations.filter(({ name }) => {
    return name && !name.includes(':');
  });

  // fix extension elements
  delete findProperty('DMNElement#extensionElements', model).isMany;

  findProperty('TextAnnotation#textFormat', model).default = 'text/plain';

  findProperty('ExtensionElements#extensionElement', model).name = 'values';

  // fix `Context#contextEntry` name
  findProperty('Context#contextEnrty', model).name = 'contextEntry';

  // fix `TextAnnotation#textFormat` default
  findProperty('TextAnnotation#textFormat', model).default = 'text/plain';

  findType('List', model).properties.push({
    name: 'elements',
    isMany: true,
    type: 'Expression'
  });

  // fix `ItemDefinition#containingDefinition`
  const containingDefinition = findProperty('ItemDefinition#containingDefinition', model);

  containingDefinition.name = 'functionItem';
  containingDefinition.type = 'FunctionItem';

  delete containingDefinition.isAttr;
  delete containingDefinition.isReference;

  containingDefinition.xml = {
    serialize: 'property'
  };

  // fix `FunctionItem`
  findType('FunctionItem', model).properties.push({
    name: 'parameters',
    isMany: true,
    type: 'InformationItem',
    xml: {
      serialize: 'property'
    }
  });

  removeProperties('FunctionItem', [
    'outputType'
  ], model);

  model = removeWhitespace(model);

  model = fixElementReferences(model, dmnXSD);

  model = fixPropertySerialization(model, dmnXSD);

  model = fixSequence(model, dmnXSD);

  [
    'BusinessKnowledgeModel#authorityRequirement',
    'BusinessKnowledgeModel#knowledgeRequirement',
    'Decision#authorityRequirement',
    'Decision#informationRequirement',
    'Decision#knowledgeRequirement',
    'Definitions#elementCollection',
    'Definitions#itemDefinition',
    'DMNElement#description',
    'DMNElement#extensionElements',
    'ImportedValues#importedElement',
    'Invocation#binding',
    'ItemDefinition#functionItem',
    'ItemDefinition#typeRef',
    'KnowledgeSource#authorityRequirement',
    'KnowledgeSource#type',
    'LiteralExpression#importedValues',
    'LiteralExpression#text',
    'RuleAnnotation#text',
    'TextAnnotation#text',
    'UnaryTests#text'
  ].forEach(name => {
    delete findProperty(name, model).xml;
  });

  [
    'Artifact',
    'BusinessContextElement',
    'DRGElement',
    'ElementCollection',
    'Import',
    'ItemDefinition'
  ].forEach(name => {
    removeProperties(name, [
      'definitions'
    ], model);
  });

  // remove `AuthorityRequirement` properties
  removeProperties('AuthorityRequirement', [
    'bkm',
    'decision',
    'knowledgeSource'
  ], model);

  // remove `Binding` properties
  removeProperties('Binding', [
    'context',
    'decisionTable',
    'functionDefinition',
    'invocation',
    'list',
    'literalExpression',
    'relation'
  ], model);

  // remove `BusinessKnowledgeModel` properties
  removeProperties('BusinessKnowledgeModel', [
    'encapsulatedDecisions',
    'parameter'
  ], model);

  // remove `ContextEntry` properties
  removeProperties('ContextEntry', [
    'context',
    'decisionTable',
    'functionDefinition',
    'invocation',
    'list',
    'literalExpression',
    'relation'
  ], model);

  // remove `Decision` properties
  removeProperties('Decision', [
    'context',
    'decisionTable',
    'functionDefinition',
    'invocation',
    'list',
    'literalExpression',
    'relation',
    'requiresInformation'
  ], model);

  // remove `DecisionRule` properties
  removeProperties('DecisionRule', [
    'decisionTable'
  ], model);

  // remove Defintions#association, Definitions#group and Defintions#textAnnotation
  // artifacts will be accessible through Definitions#artifact
  removeProperties('Definitions', [
    'association',
    'group',
    'textAnnotation'
  ], model);

  // remove `Expression` properties
  removeProperties('Expression', [
    'binding',
    'caller',
    'contextEntry',
    'decision',
    'functionDefinition',
    'list',
    'type'
  ], model);

  // remove `ExtensionAttribute` properties
  removeProperties('ExtensionAttribute', [
    'element'
  ], model);

  // remove `ExtensionElements` properties
  removeProperties('ExtensionElements', [
    'element'
  ], model);

  // remove `FunctionDefinition` properties
  removeProperties('FunctionDefinition', [
    'bkm',
    'context',
    'decisionTable',
    'invocation',
    'literalExpression',
    'relation'
  ], model);

  // remove `InformationItem` properties
  removeProperties('InformationItem', [
    'binding',
    'bkm',
    'context',
    'contextEntry',
    'decisionOutput',
    'decisionTable',
    'functionDefinition',
    'inputData',
    'invocation',
    'list',
    'literalExpression',
    'relation',
    'type',
    'valueExpression'
  ], model);

  // remove `InformationRequirement` properties
  removeProperties('InformationRequirement', [
    'decision'
  ], model);

  // remove `InputClause` properties
  removeProperties('InputClause', [
    'decisionTable'
  ], model);

  // remove `InputData` properties
  removeProperties('InputData', [
    'requiresInformation'
  ], model);

  // remove `Invocation` properties
  removeProperties('Invocation', [
    'context',
    'decisionTable',
    'literalExpression',
    'relation'
  ], model);

  // remove `ItemDefinition` properties
  removeProperties('ItemDefinition', [
    'definitions'
  ], model);

  // remove `KnowledgeRequirement` properties
  removeProperties('KnowledgeRequirement', [
    'bkm',
    'decision'
  ], model);

  // remove `List` properties
  removeProperties('List', [
    'context',
    'decisionTable',
    'element',
    'invocation',
    'literalExpression',
    'relation'
  ], model);

  // remove `LiteralExpression` properties
  removeProperties('LiteralExpression', [
    'expressionInput',
    'output',
    'ruleOutput'
  ], model);

  // remove `OutputClause` properties
  removeProperties('OutputClause', [
    'outputDefinition'
  ], model);

  // remove `RuleAnnotation` properties
  removeProperties('RuleAnnotation', [
    'ruleAnnotation'
  ], model);

  // remove `UnaryTests` properties
  removeProperties('UnaryTests', [
    'allowedInItemDefinition',
    'input',
    'output',
    'ruleInput'
  ], model);

  orderProperties('Invocation', [
    'calledFunction',
    'binding'
  ], model);

  // set uri
  model.uri = dmnXSD.elementsByTagName[ 'xsd:schema' ][ 0 ].targetNamespace;

  return model;
};

/**
 * As specified in the XSD, in some instances, elements are not referenced via an attribute but via
 * a child element with an `href` property.
 *
 * Instead of
 *
 * <informationRequirement requiredDecision="#season">
 *
 * the element is referenced like this:
 *
 * <informationRequirement>
 *   <requiredDecision href="#season" />
 * </informationRequirement>
 *
 * Therefore, a `DMNElementReference` type is introduced.
 */
function fixElementReferences(model, xsd) {
  const { elementsByTagName } = xsd,
        xsdSchema = elementsByTagName[ 'xsd:schema' ][ 0 ];

  // (1) add `DMNElementReference` type
  model.types = [
    ...model.types,
    {
      name: 'DMNElementReference',
      properties: [
        {
          isAttr: true,
          name: 'href',
          type: 'String',
        },
      ],
    }
  ];

  // (2) fix element references
  model.types.forEach(type => {
    const {
      name,
      properties
    } = type;

    if (!properties) {
      return;
    }

    const xsdName = `t${ name }`;

    const xsdType = xsdSchema.children.find(matchPattern({ name: xsdName }));

    if (!xsdType) {
      return;
    }

    // (2.1) get element references
    const elementReferences = type.properties.filter(property => {
      const xsdElements = findChildren(xsdType, matchPattern({ tagName: 'xsd:element' }));

      if (!xsdElements) {
        return false;
      }

      const xsdElement = xsdElements.find(matchPattern({ name: property.name }));

      if (!xsdElement) {
        return false;
      }

      return xsdElement.type === 'tDMNElementReference';
    });

    // (2.2) fix element references
    properties.forEach(property => {
      if (elementReferences.find(matchPattern({ name: property.name }))) {
        property.type = 'DMNElementReference';

        // serialize as child element instead of attribute
        property.xml = {
          serialize: 'property'
        };

        delete property.isReference;
      }
    });
  });

  return model;
}

/**
 * Serialize properties if specified in XSD.
 *
 * Serializes
 *
 * {
 *   $type: "DecisionTable",
 *   input: [{
 *     $type: "InputClause"
 *   }]
 * }
 *
 * as
 *
 * <decisionTable>
 *   <input />
 * </decisionTable>
 *
 * instead of
 *
 * <decisionTable>
 *   <inputClause />
 * </decisionTable>
 *
 * @param {Object} model
 *
 * @returns {Object}
 */
function fixPropertySerialization(model, xsd) {
  const { elementsByTagName } = xsd,
        xsdSchema = elementsByTagName[ 'xsd:schema' ][ 0 ];

  model.types.forEach(type => {
    const xsdComplexTypes = findChildren(xsdSchema, matchPattern({
      name: `t${ type.name }`,
      tagName: 'xsd:complexType'
    }));

    if (!xsdComplexTypes) {
      return;
    }

    const xsdComplexType = xsdComplexTypes[ 0 ];

    type.properties.forEach(property => {
      const xsdElements = findChildren(xsdComplexType, matchPattern({
        name: property.name,
        tagName: 'xsd:element'
      }));

      if (!xsdElements) {
        return;
      }

      delete property.isAttr;

      property.xml = {
        serialize: 'property'
      };
    });
  });

  return model;
}
