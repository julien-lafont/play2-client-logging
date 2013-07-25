// Karma E2E configuration

// Base path, that will be used to resolve files and exclude.
basePath = '';

// List of files / patterns to load in the browser.
files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

// List of files to exclude.
exclude = [];

// Test results reporter to use.
// Possible values: dots || progress || growl.
reporters = ['progress'];

// Web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// Enable / disable colors in the output (reporters and logs).
colors = true;

// Level of logging
// Possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG.
logLevel = LOG_INFO;

// Enable / disable watching file and executing tests whenever any file changes.
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it.
captureTimeout = 5000;

// CI mode
// If true, it capture browsers, run tests and exit.
singleRun = false;
