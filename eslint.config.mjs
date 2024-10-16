import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  lib: [
    'lib/**/*.js'
  ],
  test: [
    'test/**/*.js'
  ]
};

export default [

  // build + test
  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      ignores: files.lib
    };
  }),

  // lib
  ...bpmnIoPlugin.configs.recommended.map(config => {

    return {
      ...config,
      files: files.lib
    };
  }),

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: files.test
    };
  }),
  {
    languageOptions: {
      globals: {
        sinon: true
      }
    },
    files: files.test
  }
];