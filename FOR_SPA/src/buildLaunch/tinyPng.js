const tinypng = require('@mrkwon/tinypng');

function tinypPngMin(inDir,outDir){
    tinypng(
        inDir,
        outDir,
        "1XdBd85MCqPMP4KnBmQPFgyFC6pN8jG3"//tinypng官网申请https://tinypng.com/developers
    )
}


exports.tinypPngMin = tinypPngMin;