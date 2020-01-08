import { sync as exec } from 'execa';

import { sync as glob } from 'glob';

import {
  readFileSync as readFile,
  existsSync as exists
} from 'fs';

import path from 'path';

import { createModdle } from '../helper';

import {
  toXML,
  validate
} from '../xml-helper';

const tckDirectory = 'tmp/tck';

describe('dmn-moddle - TCK roundtrip', function() {

  const moddle = createModdle();

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
      [ 'clone', '--depth=1', 'git@github.com:dmn-tck/tck.git', tckDirectory ],
      { cwd: __dirname }
    );
  }

  const fileNames = glob(tckDirectory + '/TestCases/**/*.dmn', { cwd: __dirname });

  for (const fileName of fileNames) {

    it(`should serialize valid DMN xml after read (${ fileName })`, function(done) {
      this.timeout(5000);

      // given
      let fileContents = readFile(`${ __dirname }/${ fileName }`, 'utf8');

      // replace DMN 1.2 namespaces with DMN 1.3 namespaces
      fileContents = replaceNamespaces(fileContents, {
        'http://www.omg.org/spec/DMN/20180521/MODEL/': 'https://www.omg.org/spec/DMN/20191111/MODEL/',
        'http://www.omg.org/spec/DMN/20180521/DMNDI/': 'https://www.omg.org/spec/DMN/20191111/DMNDI/',
      });

      // when
      moddle.fromXML(fileContents, 'dmn:Definitions', function(err, result) {

        if (err) {
          done(err);

          return;
        }

        toXML(result, { format: true }, function(err, xml) {

          // then
          validate(err, xml, done);
        });
      });
    });

  }

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
