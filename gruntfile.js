module.exports = function(grunt){
  "use strict";

  require("load-grunt-tasks")(grunt);
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({

    copy: {
      main: {
        files: [
          {
            expand: true, 
            //cwd: 'src/', 
            src: ['src/js/**'], 
            dest: 'unified/', 
            rename: function(dest, src) {
              // use the source directory to create the file
              // example with your directory structure
              //   dest = 'dev/js/'
              //   src = 'module1/js/main.js'
              return dest + src.replace(new RegExp('/', 'g'), '_');
            }
          },
        ]
      }
    },

    babel: {
        options: {
            sourceMap: true,
            presets: ['es2015']
        },
        dist: {
            files: {
                'dist/app.trans.js': 'src/app.js'
            }
        }
    },

    regenerator: {
      options: {
        includeRuntime: true
      },
      dist: {
        files: {
          "dist/app.es5.js": "dist/app.trans.js"
        }
      }
    },


    uglify: {
      main: {
        files: {
          "dist/app.min.js":["dist/app.es5.js"]
        }
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

  grunt.registerTask("default", ["copy","babel","regenerator","uglify"]);

};
