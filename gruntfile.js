module.exports = function(grunt){
  "use strict";

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    jshint: {
      files: ["src/app.js"],
      options: {
        "curly": true,
        "eqeqeq": true,
        "undef": true,
        "unused": "vars",
        "esnext":true,
        "devel":true,
        "node":true,
        "noyield":true
      }
    },

    es6transpiler: {
        dist: {
            files: {
                'dist/app.js': 'src/app.js'
            }
        },
        options: {
            "disallowUnknownReferences": false,
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

    watch: {
      all: {
        files:["app.js"],
        // tasks:["jshint","es6transpiler","regenerator","uglify"],
        tasks:["jshint","babel","regenerator","uglify"],
        options:{
          spawn:false
        }
      }
    }

  });


//  grunt.registerTask("default", ["jshint","es6transpiler","regenerator","uglify","watch"]);
  grunt.registerTask("default", ["babel","regenerator","uglify"]);

};