import {
  isString,
  isFunction,
  assign
} from 'min-dash';

import Moddle from 'moddle';

import {
  Reader,
  Writer
} from 'moddle-xml';


/**
 * A sub class of {@link Moddle} with support for import and export of DMN xml files.
 *
 * @class DmnModdle
 * @extends Moddle
 *
 * @param {Object|Array} packages to use for instantiating the model
 * @param {Object} [options] additional options to pass over
 */
export default function DmnModdle(packages, options) {
  Moddle.call(this, packages, options);
}

DmnModdle.prototype = Object.create(Moddle.prototype);


/**
 * Instantiates a DMN model tree from a given xml string.
 *
 * @param {String}   xmlStr
 * @param {String}   [typeName='dmn:Definitions'] name of the root element
 * @param {Object}   [options]  options to pass to the underlying reader
 * @param {Function} done       callback that is invoked with (err, result, parseContext)
 *                              once the import completes
 */
DmnModdle.prototype.fromXML = function(xmlStr, typeName, options, done) {

  if (!isString(typeName)) {
    done = options;
    options = typeName;
    typeName = 'dmn:Definitions';
  }

  if (isFunction(options)) {
    done = options;
    options = {};
  }

  var reader = new Reader(assign({ model: this, lax: true }, options));
  var rootHandler = reader.handler(typeName);

  reader.fromXML(xmlStr, rootHandler, done);
};


/**
 * Serializes a DMN object tree to XML.
 *
 * @param {String}   element    the root element, typically an instance of `Definitions`
 * @param {Object}   [options]  to pass to the underlying writer
 * @param {Function} done       callback invoked with (err, xmlStr) once the import completes
 */
DmnModdle.prototype.toXML = function(element, options, done) {

  if (isFunction(options)) {
    done = options;
    options = {};
  }

  var writer = new Writer(options);

  var result;
  var err;

  try {
    result = writer.toXML(element);
  } catch (e) {
    err = e;
  }

  return done(err, result);
};
