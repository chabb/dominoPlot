/*global module*/

module.exports = function(grunt, tasks) {
	// Load our node module required for this task.
	grunt.loadNpmTasks('grunt-html');

	// The configuration for a specific task.
	tasks.htmllint = {
		// The files that we want to check.
		dist: {
			options: {
				path: false,
				reportpath: false // Turns logging to a file off, output will show in the CLI.
			},

			// The files that we want to check.
			src: [
				grunt.uriSrc + '*.html', // Include all HTML files in this directory.
				'!' + grunt.uriSrc + '*.min.html' // Exclude any files ending with `.min.html`
			]
		}
	};

	return tasks;
};