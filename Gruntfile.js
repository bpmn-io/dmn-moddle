'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      sources: 'lib',
      tests: 'test',
      dist: 'dist'
    },
    eslint: {
      check: {
        src: [
          '{lib,test}/**/*.js'
        ]
      },
      fix: {
        src: [
          '{lib,test}/**/*.js'
        ],
        options: {
          fix: true
        }
      }
    },
    mochaTest: {
      single: {
        options: {
          reporter: 'spec',
          require: [
            './test/expect.js'
          ]
        },
        src: ['test/**/*.js']
      },
      watch: {
        options: {
          noFail: true,
          reporter: 'spec',
          require: [
            './test/expect.js'
          ]
        },
        src: [ 'test/**/*.js' ]
      }
    },

    release: {
      options: {
        tagName: 'v<%= version %>',
        commitMessage: 'chore(project): release v<%= version %>',
        tagMessage: 'chore(project): tag v<%= version %>'
      }
    },

    watch: {
      test: {
        files: [
          '<%= config.sources %>/**/*.js',
          '<%= config.tests %>/spec/**/*.js'
        ],
        tasks: [ 'mochaTest:watch' ]
      }
    }
  });

  // tasks

  grunt.registerTask('test', [ 'mochaTest:single' ]);

  grunt.registerTask('auto-test', [ 'mochaTest:watch', 'watch:test' ]);

  grunt.registerTask('default', [ 'eslint:check', 'test' ]);
};
