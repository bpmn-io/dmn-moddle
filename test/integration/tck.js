import { sync as exec } from 'execa';

import { sync as glob } from 'glob';

import {
  readFileSync as readFile,
  existsSync as exists
} from 'fs';

import path from 'path';

import DmnModdle from 'dmn-moddle';

import { validateXML } from 'xsd-schema-validator';

import { expect } from 'chai';


const DMN_XSD = 'resources/dmn/xsd/DMN13.xsd';

const __dirname = import.meta.dirname;

const tckDirectory = 'tmp/tck';


describe('dmn-moddle - TCK roundtrip', function() {

  const moddle = new DmnModdle();

  this.timeout(30000);

  if (exists(path.join(__dirname, tckDirectory, '.git'))) {
    console.log('tck repository already cloned, fetching and checking out origin/master...');

    const cwd = path.join(__dirname, tckDirectory);

    exec('git', [ 'fetch' ], { cwd });
    exec('git', [ 'checkout', 'origin/master' ], { cwd });
  } else {
    console.log(`cloning tck repository to ${ tckDirectory }...`);

    exec(
      'git',
      [ 'clone', '--depth=1', 'https://github.com/dmn-tck/tck.git', tckDirectory ],
      { cwd: __dirname }
    );
  }

  const fileNames = glob(tckDirectory + '/TestCases/**/*.dmn', { cwd: __dirname });

  function shouldRun(fileName) {
    if ([ '0012-list-functions.dmn', '0086-import.dmn' ].some(f => fileName.endsWith(f))) {
      return false;
    }

    const match = process.env.GREP;

    return !match || fileName.toLowerCase().includes(match);
  }

  describe('should roundtrip', function() {

    for (const fileName of fileNames) {

      (shouldRun(fileName) ? it : it.skip)(fileName, async function() {

        this.timeout(5000);

        // given
        let fileContents = readFile(`${ __dirname }/${ fileName }`, 'utf8');

        // replace DMN 1.2 namespaces with DMN 1.3 namespaces
        fileContents = replaceNamespaces(fileContents, {
          'http://www.omg.org/spec/DMN/20180521/MODEL/': 'https://www.omg.org/spec/DMN/20191111/MODEL/',
          'http://www.omg.org/spec/DMN/20180521/DMNDI/': 'https://www.omg.org/spec/DMN/20191111/DMNDI/',
        });

        // when
        const {
          rootElement: definitions,
          warnings
        } = await moddle.fromXML(fileContents, 'dmn:Definitions');

        const warningsFiltered = filterIgnored(warnings, fileName);

        if (process.env.VERBOSE && warnings.length > 0) {
          console.log('import warnings', warningsFiltered);
        }

        expect(warningsFiltered).to.be.empty;

        // then
        const { xml } = await moddle.toXML(definitions, { format: true });

        await validate(xml);
      });
    }
  });
});

/**
 * Replace namespaces in XML.
 *
 * @param {string} xml
 * @param {Object} namespaces
 *
 * @returns {string}
 */
function replaceNamespaces(xml, namespaces) {
  for (const namespace in namespaces) {
    const namespaceRegExp = new RegExp(namespace, 'g');

    xml = xml.replace(namespaceRegExp, namespaces[ namespace ]);
  }

  return xml;
}

function filterIgnored(warnings, fileName) {

  if (fileName.endsWith('0086-import.dmn')) {
    return warnings.filter(err => err.message !== 'unresolved reference <include1:_32543811-b499-4608-b784-6c6f294b1c58>');
  }

  if (fileName.endsWith('0012-list-functions.dmn')) {
    return warnings.filter(err => err.message !== 'unresolved reference <_883c9eb4-1f4f-4885-82c0-234f9ac9a1d7>');
  }

  return warnings;
}

function validate(xml) {

  return new Promise((resolve, reject) => {
    validateXML(xml, DMN_XSD, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });

}
