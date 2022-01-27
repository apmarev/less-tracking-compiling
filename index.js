'use strict';

let config = require("./less-tracking-compilling.config.json")

let glob = require("glob")
    , fs = require('fs')
    , chokidar = require('chokidar')
    , lessWatchCompilerUtils = require("less-watch-compiler/dist/lib/lessWatchCompilerUtils")

let watcher = chokidar.watch(
__dirname + '/' + config.watchFolder + '/*.less',
{
            ignored: __dirname + '/' + config.tmpFolder,
            persistent: true
        }
    )

watcher
    .on('all', (event, path) => {
        console.log('File', path, 'has been changed')
        getDirectories(__dirname, function (err, res) {
            if (!err) {
                res.map(item => {
                    let path = item.split("/")
                    let name = path.pop()

                    let one = fs.readFileSync( __dirname + "/" + config.lessVarsFile)
                    let two = fs.readFileSync( item )

                    let newPathFile = __dirname + "/" + config.tmpFolder + "/" + name

                    fs.writeFile(newPathFile, one + two, (err) => {
                        if(!err) {
                            compileCSS(newPathFile, (err) => {
                                if(!err) { deleteLess(response) }
                            })
                        }

                    })



                })
            }
        })
    })

let getDirectories = function (src, callback) {
    glob(src + '/**/style/*.less', callback);
};

const compileCSS = (path) => {
    lessWatchCompilerUtils.config.watchFolder = __dirname + "/src/tmp"
    lessWatchCompilerUtils.config.outputFolder = __dirname + "/src/assets/css"
    lessWatchCompilerUtils.config.minified = true
    lessWatchCompilerUtils.compileCSS(path)

    return path
}

const deleteLess = (path) => {
    fs.stat(path, function (err, stats) {

        if (err) {
            return console.error(err);
        }

        fs.unlink(path ,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
        });
    })
}
