module.exports = function(grunt) {    
    grunt.initConfig({
        mutationTest: {
            options: {
                karma: {
                    configFile: __dirname+ '/karma.conf.js',
                },
                reporters: {
                    html: {
                        dir: 'reports/mutation-test-html'
                    },
                    text: {
                        dir: 'reports/mutation-test-text'
                    }
                }
            },
            all: {
                options: {
                    code: [ 'node_modules/jquery/dist/jquery.min.js',
                        'node_modules/angular/angular.js',
                        'node_modules/angular-route/angular-route.js',
                        'node_modules/angular-animate/angular-animate.js',
                        'node_modules/angular-aria/angular-aria.js',
                        'node_modules/angular-material/angular-material.js',
                        'node_modules/angular-cookies/angular-cookies.js',
                        'node_modules/moment/moment.js',
                        'env_config/karma/*.js',
                        'node_modules/angular-mocks/angular-mocks.js',
                        'test/**/*.js',
                        'src/**/*.html',
                        'src/**/*.js'],
                    specs: 'test/**/*.spec.js',
                    mutate: ['src/**/*.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-mutation-testing');
};