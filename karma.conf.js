module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        frameworks: ['jasmine'],
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-route/angular-route.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/angular-material/angular-material.js',
            'node_modules/angular-cookies/angular-cookies.js',
            'src/js/app.js',
            'env_config/karma/*.js',
            'src/js/modules/**/*.js',
            'src/js/services/*.js',
            'src/js/factory/*.js',
            'src/js/data/*.js',
            'src/js/defaults/*.js',
            'src/js/components/**/*.html',
            'src/js/components/**/*.js',
            'src/js/directives/**/*.html',
            'src/js/directives/**/*.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'test/**/*.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "src/js/directives/**/*.html": ["ng-html2js"],
            "src/js/components/**/*.html": ["ng-html2js"]
        },

        ngHtml2JsPreprocessor: {
              moduleName: 'app' ,
               cacheIdFromPath: function(filepath) {
                   var comps = filepath.split('/');
                    var cacheId = comps[comps.length-1];
                    return cacheId;
              }
        },



        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'junit'],

        junitReporter: {
            outputDir: 'build/test-results', // results will be saved as $outputDir/$browserName.xml
            outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '', // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            properties: {}, // key value pair of properties to add to the <properties> section of the report
            xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
