import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  build: [
    'tasks/**/*.cjs',
    '*.js'
  ],
  test: [
    'test/**/*.js',
    'test/**/*.cjs'
  ],
  ignored: [
    'dist',
    'tmp'
  ]
};

export default [
  {
    'ignores': files.ignored
  },

  // build
  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      files: files.build
    };
  }),

  // lib + test
  ...bpmnIoPlugin.configs.recommended.map(config => {

    return {
      ...config,
      ignores: files.build
    };
  }),

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: files.test
    };
  }),

  // support "with" import
  {
    languageOptions: {
      ecmaVersion: 'latest'
    }
  }
];
