module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        availabletasks: {
            tasks: {}
        },

        jshint: {
            options: {
                //'-W107': true
            },
            dev: {
                src: ['src/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            },
            config: {
                src: ['Gruntfile.js', 'karma.conf.js']
            }
        },

        concat: {
            dist: {
                src: [
                    'src/cache.js',
                    'src/storage/*.js',
                    'src/cacheitem.js',
                    'src/container.js'
                ],
                dest: 'dist/cache.js'
            }
        },

        bower: {
            install: {
                options: {
                    copy: false,
                    verbose: true
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                autoWatch: false,
                singleRun: true
            }
        },

        mochacli: {
            options: {
                recursive: true,
                reporter: 'spec'
            },
            unit: ['./test/']
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        },

        publish: {
            main: {
                src: ['./']
            }
        }

    });

    grunt.registerTask('default', ['availabletasks:tasks']);

    grunt.registerTask('compile', ['jshint', 'concat:dist']);
    grunt.registerTask('install', ['bower:install', 'compile']);
    grunt.registerTask('test', ['compile', 'karma:unit', 'mochacli:unit']);
    grunt.registerTask('release', ['test', 'compile', 'bump:patch', 'publish']);

};
