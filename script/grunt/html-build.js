/*global module*/

module.exports = function(grunt, tasks) {
  // Load our node module required for this task.
  grunt.loadNpmTasks('grunt-html-build');
  tasks.htmlbuild = {
    dev: {
      src: '<%= grunt.uriSrc %>/index.tpl.html',
      dest: '<%= grunt.uriStatic %>/index.html',
      options: {
        beautify: true,
        prefix: '',
        relative: true,
        scripts: {
          bundle: [
          '<%= grunt.uriSrc %>/scripts/*.js',
          '!**/main.js',
          ],
          libs: [
            '<%= grunt.uriSrc %>/../lib/*.js',
          ]
        },
        styles: {
          bundle: [
          '<%= grunt.uriSrc %>/../assets/css/*.css',
          ]
        },
        data: {
                // Data to pass to templates
          version: tasks.pkg.version,
          title: tasks.pkg.name

        }

      }
    }
  }
  return tasks;
}
