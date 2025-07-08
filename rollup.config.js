import json from '@rollup/plugin-json';

import pkg from './package.json' with { type: 'json' };

function pgl(plugins = []) {
  return [
    json(),
    ...plugins
  ];
}

const srcEntry = 'lib/index.js';

export default [
  {
    input: srcEntry,
    output: [
      { file: pkg.exports['.'].require, format: 'cjs' },
      { file: pkg.exports['.'].import, format: 'es' }
    ],
    external: [
      'min-dash',
      'moddle',
      'moddle-xml'
    ],
    plugins: pgl()
  }
];
