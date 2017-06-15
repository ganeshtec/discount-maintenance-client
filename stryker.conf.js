// stryker.conf.js
module.exports = function (config) {
  config.set({
    files: [
      // Add your files here, this is just an example:

      { pattern: 'node_modules/jquery/dist/jquery.min.js', mutated: false, included: true },
      { pattern: 'node_modules/angular/angular.js', mutated: false, included: true },
      { pattern: 'node_modules/angular-route/angular-route.js', mutated: false, included: true },
      { pattern: 'node_modules/angular-animate/angular-animate.js', mutated: false, included: true },
      { pattern: 'node_modules/angular-aria/angular-aria.js', mutated: false, included: true },
      { pattern: 'node_modules/angular-material/angular-material.js', mutated: false, included: true },
      { pattern: 'node_modules/angular-cookies/angular-cookies.js', mutated: false, included: true },
      { pattern: 'node_modules/angular-mocks/angular-mocks.js', mutated: false, included: true },
      { pattern: 'node_modules/moment/moment.js', mutated: false, included: true },
      { pattern: 'env_config/karma/*.js', mutated: false, included: true },
      { pattern: 'src/**/*.js', mutated: true, included: true },
      'test/**/*.js',
      // '!src/fileToIgnore.js' // You can exclude files if you want
    ],
    testRunner: 'karma',
    testFramework: 'jasmine',
    coverageAnalysis: 'all',
    reporter: ['html', 'progress'],
    karmaConfigFile: 'karma.conf.js'
  });
}