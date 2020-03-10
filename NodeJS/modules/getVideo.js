var express = require('express');
var router = express.Router();

var fs = require('fs');

// GET by name
router.get('/:id', function (req, res) {
    const videopath = __dirname + "/media/" + req.params.id;

    const stat = fs.statSync(videopath);
    const fileSize = stat.size;
    
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', 'video/mp4');

    fs.createReadStream(videopath).pipe(res);
})

module.exports = router;