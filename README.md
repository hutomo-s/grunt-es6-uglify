# ES6 Compiler Tutorial!
Hey! This is a tutorial for compressing es6 javascript files. Let's learn together! 


## Prerequisites
- NodeJS
- npm

## Installation

1. Initiate npm in a new folder and install the required packages
	```
    npm init

	npm install --save-dev grunt grunt-contrib-uglify grunt-regenerator grunt-es6-transpiler load-grunt-tasks
    ```
	
    
2. Create a file: ```gruntfile.js``` with the content below:
	```
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
	```

3. Create a file: ```src/app.js``` with the content below.
    ```
    $('.title-image').hide('slow');
    $('.event-image').click(() => {
      if ($('.title-image').is(':hidden')) {
        $('.title-image').show('slow');
      } else {
        $('.title-image').slideUp('slow', () => {
          $('.title-image').removeClass('hide');
        });
      }
      setTimeout(() => {
        $('.title-image').slideUp('slow', () => {
          $('.title-image').removeClass('hide');
        });
      }, 3000);
    });
    $(() => {
      const viewer = ImageViewer();
      $('.gallery-items').click(function () {
        const imgSrc = this.src;
        const highResolutionImage = $(this).data('high-res-img');
        viewer.show(imgSrc, highResolutionImage);
      });
    });
    ```
4. Run the task using grunt command.
    ```
    grunt
    ```

## Explanation of gruntfile.js

```grunt babel```
- Transpile and output dist/app.trans.js

```grunt regenerator```
- Input: dist/app.trans.js. Output: dist/app.es5.js

```grunt uglify```
- Input: dist/app.es5.js. Output: dist/app.min.js


## Change or Modifications Guideline

1. Find the task on gruntfile.js and modify task one by one.
2. Test it in development (or local) server.
    ```grunt```
3. Deploy to production server.


## Copyright

Copyright 2017 by Hutomo Sugianto. All rights reserved.