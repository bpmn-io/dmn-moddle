const fs = require('fs');

const {
  groupBy,
  matchPattern
} = require('min-dash');

const {
  findChildren,
  findProperty,
  findType,
  fixSequence,
  parseXML,
  removeWhitespace
} = require('./helper');

module.exports = async function(results) {
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

  model = removeWhitespace(model);

  const file = fs.readFileSync('resources/dmn/xsd/DMN13.xsd', 'utf8');

  const xsd = await parseXML(file);

  model = fixElementReferences(model, xsd);

  model = fixSubstitutionGroups(model, xsd);

  model = fixPropertySerialization(model, xsd);

  model = fixSequence(model, xsd);

  // remove Defintions#association, Definitions#group and Defintions#textAnnotation
  // artifacts will be accessible through Definitions#artifact
  const definitions = findType('Definitions', model);

  definitions.properties = definitions.properties.filter(({ name }) => {
    return ![ 'association', 'group', 'textAnnotation'].includes(name);
  });

  // set uri
  model.uri = xsd.elementsByTagName[ 'xsd:schema' ][ 0 ].targetNamespace;

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

/**
 * As specified in the XSD, in some instances, properties are substitutable for other properties.
 * Therefore, these properties are added to the respective types.
 *
 * Example:
 *
 * <xsd:complexType name="tDecision">
 *   ...
 *     <xsd:element ref="expression" minOccurs="0" maxOccurs="1"/>
 *   ...
 * </xsd:complexType>
 *
 * and
 *
 * <xsd:element name="decisionTable" type="tDecisionTable" substitutionGroup="expression"/>
 *
 * and
 *
 * <xsd:element name="literalExpression" type="tLiteralExpression" substitutionGroup="expression"/>
 *
 * ensure that both
 *
 * <decision>
 *   <decisionTable>
 *     ...
 *   </decisionTable>
 * </decision>
 *
 * and
 *
 * <decision>
 *   <literalExpression />
 * </decision>
 *
 * are possible.
 */
function fixSubstitutionGroups(model, xsd) {
  const { elementsByTagName } = xsd,
        xsdSchema = elementsByTagName[ 'xsd:schema' ][ 0 ];

  // (1) find all substitutes
  let substitutes = findChildren(xsdSchema, matchPattern({ tagName: 'xsd:element' }))
    .filter(({ substitutionGroup }) => substitutionGroup);

  if (!substitutes.length) {
    return model;
  }

  substitutes = groupBy(substitutes, ({ substitutionGroup }) => substitutionGroup);

  // (2) find properties that are substitutable
  model.types.forEach(type => {
    const { properties } = type;

    if (!properties) {
      return;
    }

    properties.forEach(property => {
      if (substitutes[ lowerCase(property.type) ]) {

        // (3) add substitutes
        substitutes[ lowerCase(property.type) ].forEach(substitute => {

          // (3.1) do NOT add substitute if property with same name already added
          if (type.properties.find(matchPattern({ name: substitute.name }))) {
            return;
          }

          const {
            isVirtual,
            ...rest
          } = property;

          // (3.2) add substitute
          type.properties = [
            ...type.properties,
            {
              ...rest,
              name: substitute.name,
              type: substitute.type.slice(1)
            }
          ];
        });
      }
    });
  });

  return model;
}

function lowerCase(string) {
  return `${ string.charAt(0).toLowerCase() }${ string.slice(1) }`;
}
