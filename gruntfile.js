var properties = require('./src/js/game/properties.js');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-pngmin');

    var productionBuild = !!(grunt.cli.tasks.length && grunt.cli.tasks[0] === 'build');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')

        ,
        properties: properties

        ,
        project: {
            src: 'src/js',
            js: '<%= project.src %>/game/{,*/}*.js',
            dest: 'build/js',
            bundle: 'build/js/app.min.js',
            port: properties.port,
            banner: '/*\n' +
                ' * <%= properties.title %>\n' +
                ' * <%= pkg.description %>\n' +
                ' *\n' +
                ' * @author <%= pkg.author %>\n' +
                ' * @version <%= pkg.version %>\n' +
                ' * @copyright <%= pkg.author %>\n' +
                ' * @license <%= pkg.license %> licensed\n'
        }

        ,
        connect: {
            dev: {
                options: {
                    port: '<%= project.port %>',
                    base: './build'
                }
            }
        }

        ,
        jshint: {
            files: ['gruntfile.js', '<%= project.js %>'],
            options: {
                jshintrc: '.jshintrc'
            }
        }

        ,
        watch: {
            options: {
                livereload: productionBuild ? false : properties.liveReloadPort
            },
            js: {
                files: 'build/**/*.js',
                tasks: ['jshint']
            },
            sass: {
                files: 'src/style/{,*/}*.{scss,sass}',
                tasks: ['sass', 'autoprefixer']
            },
            images: {
                files: 'src/images/**/*',
                tasks: ['copy:images']
            },
            audio: {
                files: 'src/audio/**/*',
                tasks: ['copy:audio']
            },
            hmtl: {
                files: 'src/templates/**/*',
                tasks: ['copy:html']
            },
            livereload: {
                files: ['build/**/*'],
                options: {
                    livereload: true
                }
            }
        },
        browserify: {
            app: {
                src: ['<%= project.src %>/game/app.js'],
                dest: '<%= project.bundle %>',
                options: {
                    transform: ['browserify-shim'],
                    watch: true,
                    keepAlive: false,
                    bundleOptions: {
                        debug: !productionBuild
                    }
                }
            }
        }

        ,
        open: {
            server: {
                path: 'http://localhost:<%= project.port %>'
            }
        }

        ,
        cacheBust: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [{
                    src: ['build/index.html', '<%= project.bundle %>']
                }]
            }
        }

        ,
        clean: ['./build/']

        ,
        pngmin: {
            options: {
                ext: '.png',
                force: true
            },
            compile: {
                files: [{
                    src: 'src/images/*.png',
                    dest: 'src/images/'
                }]
            }
        }

        ,
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['**'],
                    dest: 'build/images/'
                }]
            },
            audio: {
                files: [{
                    expand: true,
                    cwd: 'src/audio/',
                    src: ['**'],
                    dest: 'build/audio/'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: 'src/templates/',
                    src: ['**'],
                    dest: 'build/'
                }]
            }
        }

        ,
        uglify: {
            options: {
                banner: '<%= project.banner %>'
            },
            dist: {
                files: {
                    '<%= project.bundle %>': '<%= project.bundle %>'
                }
            }
        }

        ,
        sass: {
            options: {
                sourcemap: 'none'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/style',
                    src: ['*.scss'],
                    dest: 'build/style',
                    ext: '.css'
                }]
            }
        }

        ,
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'build/styles/',
                    src: '{,*/}*.css',
                    dest: 'build/styles/'
                }]
            }
        }

        ,
        compress: {
            options: {
                archive: '<%= pkg.name %>.zip'
            },
            zip: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['**/*'],
                    dest: '<%= pkg.name %>/'
                }]
            },
            cocoon: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['**/*']
                }]
            }
        }
    });

    grunt.registerTask('default', ['clean', 'browserify', 'sass', 'copy', 'connect', 'open', 'watch']);
    grunt.registerTask('build', ['jshint', 'clean', 'browserify', 'sass', 'uglify', 'copy', 'cacheBust', 'connect', 'open', 'watch']);
    grunt.registerTask('optimise', ['pngmin', 'copy:images']);
    grunt.registerTask('cocoon', ['compress:cocoon']);
    grunt.registerTask('zip', ['compress:zip']);
};