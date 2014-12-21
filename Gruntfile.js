module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        availabletasks: {
            tasks: {}
        },

        jshint: {
            options: {
                '-W107': true
            },
            dev: {
                src: ['src/**/*.js']
            },
            dist: {
                src: ['dist/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            },
            config: {
                src: ['Gruntfile.js', 'karma.conf.js']
            }
        },

        copy: {
            hooks: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'git_hooks/',
                        src: '*',
                        dest: '.git/hooks/'
                    }
                ]
            }
        },

        concat: {
            dist: {
                src: 'src/**/*.js',
                dest: 'dist/cachejs.js'
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
                reporter: 'progress'
            },
            unit: ['test/node/']
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

    grunt.registerTask('compile', ['compile:dev', 'compile:dist']);
    grunt.registerTask('compile:dev', ['jshint:dev', 'jshint:config', 'jshint:test']);
    grunt.registerTask('compile:dist', ['concat:dist', 'jshint:dist']);
    grunt.registerTask('test', ['compile:dev', 'karma:unit', 'mochacli:unit']);

    grunt.registerTask('prepush', ['test']);

    // Keep test (even if pre-push hook also test) to avoid bump create tag if failed.
    grunt.registerTask('release', ['compile:dist', 'bump:patch', 'publish']);

};
