module.exports = function(grunt){
  "use strict";

  require("load-grunt-tasks")(grunt);

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({

    copy: {
      main: {
        files: [
          {
            expand: true, 
            src: ['src/js/**'], 
		    dest: 'unified/', 
            rename: function(dest, src) {
              // use the source directory to create the file
              // example with your directory structure
              //   dest = 'dev/js/'
              //   src = 'module1/js/main.js'
              var new_src = src.replace(new RegExp('/', 'g'), '_');
              var final_src = new_src.replace("src_js_", "");

              return dest + final_src;
            }
          },
        ]
      }
    },

    babel: {
        options: {
            sourceMap: true,
            // add react
            presets: ['es2015','react'],
            compact: true, // readability
        },
        dist: {
            // files: {
            //     'dist/app.trans.js': 'src/app.js'
            // }
            files: [{
              expand: true,
              cwd: 'unified/',
              src: ['*.js'],
              dest: 'dist/',
              ext: '.trans.js',
            }],
        }
    },

    clean: {
      subfolders: ['unified/*/'],
      contents: ['dist/*.trans.js', 'dist/*.es5.js', 'dist/*.map'],
    },

    regenerator: {
      options: {
        includeRuntime: true
      },
      dist: {
        files: [{
              expand: true,
              cwd: 'dist/',
              src: ['*.trans.js'],
              dest: 'dist/',
              ext: '.es5.js',
            }],
      }
    },


    uglify: {
      main: {
        // files: {
        //   "dist/app.min.js":["dist/app.es5.js"]
        // }
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['*.es5.js'],
          dest: 'dist/',
          ext: '.min.js',
        }]
      },
      options: {
        mangle:{toplevel:true},
        sourceMap: true,
        sourceMapName: "app.js.map",
        sourceMapIncludeSources: true,
        compress:true
      }
    },

  });

  grunt.registerTask("default", ["copy","babel","regenerator","uglify","clean"]);

};
