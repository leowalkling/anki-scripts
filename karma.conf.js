// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'browserify'],

    browserify: {
		files: [
			"test/*"
		]
	},
	
    preprocessors: {
        "/**/*.browserify": "browserify"
    },
	
    client: {
      mocha: {
        ui: 'bdd'
      }
    }
  });
};