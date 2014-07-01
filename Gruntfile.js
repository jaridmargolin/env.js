/*
 * Gruntfile.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */


module.exports = function (grunt) {


// Load tasks
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


// Browsers
var browsers = [
  // Latest Versions
  { browserName: 'firefox', platform: 'WIN8' },
  { browserName: 'chrome', platform: 'WIN8' },
  { browserName: 'opera', platform: 'WIN7' },

  // Internet Explorer
  { browserName: 'internet explorer', platform: 'WIN8', version: '10' },
  { browserName: 'internet explorer', platform: 'VISTA', version: '9' },
  { browserName: 'internet explorer', platform: 'XP', version: '8' }
];


// Config
grunt.initConfig({

  // --------------------------------------------------------------------------
  // PKG CONFIG
  // --------------------------------------------------------------------------

  'pkg': grunt.file.readJSON('package.json'),


  // --------------------------------------------------------------------------
  // JSHINT
  // --------------------------------------------------------------------------

  'jshint': {
    src: [
      'Gruntfile.js',
      'src/**/*.js',
      'test/**/*.js'
    ],
    build: [
      'dist/**/*.js',
      '!dist/**/*.min.js'
    ],
    options: {
      jshintrc: '.jshintrc',
      force: true
    }
  },


  // --------------------------------------------------------------------------
  // CLEAN (EMPTY DIRECTORY)
  // --------------------------------------------------------------------------

  'clean': {
    dist: [
      'dist'
    ],
    docs: [
      'docs/javascripts/env.js',
      'docs/javascripts/env.min.js',
      'docs/index.md'
    ]
  },


  // --------------------------------------------------------------------------
  // REQUIREJS BUILD
  // --------------------------------------------------------------------------

  'requirejs': {
    compile: {
      options: {
        name: 'env',
        baseUrl: 'src',
        out: 'dist/env.js',
        optimize: 'none',
        skipModuleInsertion: true,
        paths: {
          'dom-event': '../node_modules/dom-event.js/dist/amd/dom-event'
        },
        onBuildWrite: function(name, path, contents) {
          return require('amdclean').clean({
            code: contents,
            prefixMode: 'camelCase',
            escodegen: {
              format: {
                indent: { style: '  ' }
              }
            }
          });
        }
      }
    }
  },


  // --------------------------------------------------------------------------
  // UMD WRAP
  // --------------------------------------------------------------------------

  'umd': {
    umd: {
      src: 'dist/env.js',
      objectToExport: 'env',
      globalAlias: 'env',
      dest: 'dist/env.js'
    }
  },

  // --------------------------------------------------------------------------
  // ADD BANNER
  // --------------------------------------------------------------------------

  'concat': {
    options: {
      banner: '/*!\n' +
        ' * v<%= pkg.version %>\n' +
        ' * Copyright (c) 2014 Jarid Margolin\n' +
        ' * env.js is open sourced under the MIT license.\n' +
        ' */ \n\n',
      stripBanners: true
    },
    umd: {
      src: 'dist/env.js',
      dest: 'dist/env.js'
    }
  },

  // --------------------------------------------------------------------------
  // MINIFY JS
  // --------------------------------------------------------------------------

  'uglify': {
    umd: {
      expand: true,
      cwd: 'dist/',
      src: ['**/*.js'],
      dest: 'dist/',
      ext: '.min.js'
    }
  },


  // --------------------------------------------------------------------------
  // CREATE COMMONJS VERSION IN DIST
  // --------------------------------------------------------------------------

  'nodefy': {
    all: {
      expand: true,
      src: ['**/*.js'],
      cwd: 'src/',
      dest: 'dist/common'
    }
  },


  // --------------------------------------------------------------------------
  // COPY AMD TO DIST
  // --------------------------------------------------------------------------

  'copy': {
    amd: {
      expand: true,
      src: ['**/*.js'],
      cwd: 'src/',
      dest: 'dist/amd'
    },
    javascripts: {
      expand: true,
      src: ['*.js'],
      cwd: 'dist',
      dest: 'docs/javascripts'
    },
    readme: {
      src: 'README.md',
      dest: 'docs/index.md'
    }
  },


  // --------------------------------------------------------------------------
  // WRAP
  // --------------------------------------------------------------------------

  'wrap': {
    readme: {
      src: ['docs/index.md'],
      dest: 'docs/index.md',
      options: {
        wrapper: ['---\nlayout: master\n---\n{% raw %}', '{% endraw %}']
      }
    }
  },

  // --------------------------------------------------------------------------
  // WATCH FILES
  // --------------------------------------------------------------------------

  'watch': {
    options: { spawn: true },
    build: {
      files: ['Gruntfile.js'],
      tasks: ['build', 'docs'],
      options: { livereload: true }
    },
    src: {
      files: ['src/**/*.js'],
      tasks: ['build'],
      options: { livereload: true }
    },
    docs: {
      files: ['docs/**/*'],
      tasks: ['jekyll'],
      options: { livereload: true }
    },
    test: {
      files: ['test/**/*'],
      options: { livereload: true }
    }
  },


  // --------------------------------------------------------------------------
  // STATIC SERVER
  // --------------------------------------------------------------------------

  'connect': {
    docs: {
      options: { base: '_site', port: 9998 }
    },
    test: {
      options: { base: '', port: 9999 }
    }
  },


  // --------------------------------------------------------------------------
  // BUILD AND SERVE JEKYLL DOCS
  // --------------------------------------------------------------------------

  'jekyll': {
    all: {
      options: {
        src : 'docs',
        dest: '_site'
      }
    }
  },


  // --------------------------------------------------------------------------
  // PUSH DOCS LIVE
  // --------------------------------------------------------------------------

  'gh-pages': {
    options: {
      base: 'docs'
    },
    src: ['**']
  },


  // --------------------------------------------------------------------------
  // TESTS
  // --------------------------------------------------------------------------

  'saucelabs-mocha': {
    all: {
      options: {
        urls: ['http://127.0.0.1:9999/test/_runner.html'],
        build: process.env.TRAVIS_JOB_ID || '<%= pkg.version %>',
        tunnelTimeout: 5,
        concurrency: 3,
        browsers: browsers,
        testname: 'env.js'
      }
    }
  },


  // --------------------------------------------------------------------------
  // MOCHA
  // --------------------------------------------------------------------------

  'mocha_phantomjs': {
    all: ['test/_runner.html']
  }

});


// Tasks
grunt.registerTask('default', ['build']);
grunt.registerTask('dev', ['build', 'docs', 'connect', 'watch']);
grunt.registerTask('test', ['build', 'mocha_phantomjs']);
grunt.registerTask('test-cloud', ['build', 'connect:test', 'saucelabs-mocha']);
grunt.registerTask('docs', ['clean:docs', 'copy:javascripts', 'copy:readme', 'wrap:readme', 'jekyll']);
grunt.registerTask('build', ['jshint:src', 'clean:dist', 'requirejs', 'umd:umd', 'concat:umd', 'uglify:umd', 'nodefy', 'copy:amd']);


};