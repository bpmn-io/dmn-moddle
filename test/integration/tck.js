import { spawnSync as exec } from 'node:child_process';

import { globSync as glob } from 'glob';

import {
  readFileSync as readFile,
  existsSync as exists
} from 'node:fs';

import path from 'node:path';
import process from 'node:process';

import DmnModdle from 'dmn-moddle';

import { validateXML } from 'xsd-schema-validator';

import { expect } from 'chai';


const DMN_XSD = 'resources/dmn/xsd/DMN13.xsd';

const __dirname = path.join(import.meta.dirname, '../..');

const tckDirectory = 'tmp/tck';

const tckBranch = 'master';


describe('dmn-moddle - TCK roundtrip', function() {

  const moddle = new DmnModdle();

  this.timeout(30000);

  if (exists(path.join(tckDirectory, '.git'))) {
    console.log(`dmn-tck/tck repository already cloned, fetching and checking out ${tckBranch}...`);

    const cwd = path.join(__dirname, tckDirectory);

    exec('git', [ 'fetch' ], { cwd });
    exec('git', [ 'checkout', tckBranch ], { cwd });
  } else {
    console.log(`cloning repository dmn-tck/tck#${tckBranch} to ${ tckDirectory }...`);

    exec(
      'git',
      [ 'clone', '--depth=1', `--branch=${tckBranch}`, 'https://github.com/dmn-tck/tck.git', tckDirectory ],
      { cwd: __dirname }
    );
  }

  const fileNames = glob(tckDirectory + '/TestCases/**/*.dmn', { cwd: __dirname });

  function shouldRun(fileName) {
    if ([ '0012-list-functions.dmn', '0086-import.dmn' ].some(f => fileName.endsWith(f))) {
      return false;
    }

    // DMN 1.5 (unsupported)
    if ([
      '1154-boxed-every.dmn',
      '1161-boxed-list-expression.dmn',
      '1153-boxed-some.dmn',
      '1152-boxed-for.dmn',
      '1150-boxed-conditional.dmn',
      '1151-boxed-filter.dmn'
    ].some(f => fileName.endsWith(f))) {
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

          // DMN 1.2
          'http://www.omg.org/spec/DMN/20180521/MODEL/': 'https://www.omg.org/spec/DMN/20191111/MODEL/',
          'http://www.omg.org/spec/DMN/20180521/DMNDI/': 'https://www.omg.org/spec/DMN/20191111/DMNDI/',

          // DMN 1.4
          'https://www.omg.org/spec/DMN/20211108/MODEL/': 'https://www.omg.org/spec/DMN/20191111/DMNDI/',

          // DMN 1.5
          'https://www.omg.org/spec/DMN/20230324/MODEL/': 'https://www.omg.org/spec/DMN/20191111/MODEL/',
          'https://www.omg.org/spec/DMN/20230324/DMNDI/': 'https://www.omg.org/spec/DMN/20191111/DMNDI/'
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

        expect(warningsFiltered, 'import warnings').to.be.empty;

        // then
        const { xml } = await moddle.toXML(definitions, { format: true });

        await validateXML(xml, DMN_XSD);
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