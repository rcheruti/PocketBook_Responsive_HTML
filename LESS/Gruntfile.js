
module.exports = function (grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  
  var src = 'src/',
      dist = 'public_html/';
  
  grunt.initConfig({
    clean:[dist+'css'],
    less:{
      build:{
        files:[{
            src: [ src+'index.less', src+'estilos.less', src+'**.less' ],
            dest: dist+'css/estilos.css'
        }]
      }
    }
  });
  
  
  grunt.registerTask('default',['clean','less']);
  
};
