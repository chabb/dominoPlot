  /*global module*/

module.exports = function(grunt, tasks) {
    // Load our node module required for this task.
    grunt.loadNpmTasks('grunt-contrib-connect');

    // The configuration for a specific task.
    tasks.connect = {
      server: {
       options: {
         port: 8001,
         protocol: 'http',
         hostname: '*',
         base: './web/',
         keepalive: false, // watch task is there
         open: true
       }
     }
   }
  return tasks;
};
