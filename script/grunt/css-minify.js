/*global module*/

module.exports = function(grunt, tasks) {
	// Load our node module required for this task.
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// The configuration for a specific task.
	tasks.cssmin = {
		dist: {
			cwd: grunt.uriSrc, // The current working directory.
			dest: grunt.uriDist, // The destination directory to store our minified files.
			expand: true,
			ext: '.min.css', // The extension to use for our minified file.
			src: [
				'../dist/concat.css', // Specific rule to minify our `concat.css` file in our dist directory.
				'*.css', // Include all CSS files in this directory.
				'!*.min.css' // Exclude any files ending with `.min.css`
			]
		}
	};

	return tasks;
};