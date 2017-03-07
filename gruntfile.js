module.exports = function(grunt){
  "use strict";

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
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

  grunt.registerTask("default", ["babel","regenerator","uglify"]);

};