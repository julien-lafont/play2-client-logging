// Generated on 2013-07-09 using generator-angular 0.3.0, then modified.
'use strict';
var LIVERELOAD_PORT = 35729;
var snippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mount = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Advice
//
// For performance, match only one level down with:
//     …/{,*/}*.js
// instead of:
//     …/**/*.js

module.exports = function(grunt) {
  // # Load grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Paths
  var config = {
    app: 'app'
  };

  try {
    config.app = require('./bower.json').appPath || config.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: config,
    watch: {
      options: {
        livereload: LIVERELOAD_PORT
      },
      less: {
        files: '<%= yeoman.app %>/less/*.less',
        tasks: ['less', 'copy:tmp']
      },
      bower_components: {
        files: '<%= yeoman.app %>/bower_components/**/*.{css,js}',
        tasks: ['copy:bower_components']
      },
      assets: {
        files: [
          '<%= yeoman.app %>/play-assets/fonts/iconic/font/iconic {fill,stroke}/*.{afm,css,eot,svg,ttf,woff}',
          '<%= yeoman.app %>/play-assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '{.tmp,<%= yeoman.app %>}/play-assets/**/*.{css,js,html}'
        ]
      },
      views: {
        files: '<%= yeoman.app %>/play-views/**/*.scala.html'
      }
    },
    connect: {
      options: {
        port: 8000,
        hostname: 'localhost' // or '0.0.0.0' to access the server from outside.
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              snippet,
              mount(connect, '.tmp'),
              mount(connect, config.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function(connect) {
            return [
              mount(connect, '.tmp'),
              mount(connect, 'test')
            ];
          }
        }
      }
    },
    clean: ['.tmp'],
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/play-assets/scripts/**/*.js'
      ]
    },
    less: {
      server: {
        options: {
          paths: [
            '<%= yeoman.app %>/less/imports',
            '<%= yeoman.app %>/bower_components/bootstrap/less'
          ]
        },
        files: [ {
          src: '<%= yeoman.app %>/less/main.less',
          dest: '.tmp/play-assets/styles/clientlog/main.css'
        }, {
          src: '<%= yeoman.app %>/bower_components/bootstrap/less/bootstrap.less',
          dest: '.tmp/bower_components/bootstrap/styles/bootstrap.css'
        }]
      }
    },
    copy: {
      tmp: {
        files: [{
          expand: true,
          cwd: '.tmp/play-assets',
          src: '**/*.{css,js}',
          dest: '<%= yeoman.app %>/play-assets/compiled'
        },
          {
            expand: true,
            cwd: '.tmp/bower_components',
            src: '**/*.{css,js}',
            dest: '<%= yeoman.app %>/play-assets/bower_components'
          }]
      },
      bower_components: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: 'bower_components/**/*.{css,js,png}',
          dest: '<%= yeoman.app %>/play-assets'
        }]
      }
    },
    concurrent: {
      server: [],
      test: [],
      dist: []
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  // # Register grunt tasks

  grunt.registerTask('server', [
    'clean',
    'less',
    'concurrent:server',
    'copy',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean',
    'concurrent:test',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('dist', [
    'clean',
    'less',
    'copy',
    // TODO: minify and so on.
    'concurrent:dist'
  ]);

  grunt.registerTask('default', [
    // TODO: re-enable it.
//  'jshint',
    'test',
    'dist'
  ]);
};
