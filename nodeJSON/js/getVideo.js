const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

// GET by name
router.get('/:id', function (req, res) {
    const videopath = path.join(__dirname, "../media/" + req.params.id);

    const stat = fs.statSync(videopath);
    const fileSize = stat.size;
    
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', 'video/mp4');

    fs.createReadStream(videopath).pipe(res);
})

module.exports = {
    router,
    getVideo: function getVideo(id) {
        const videopath = path.join(__dirname, "../media/" + id);

        const stat = fs.statSync(videopath);
        const fileSize = stat.size;
        
        res.setHeader('Content-Length', fileSize);
        res.setHeader('Content-Type', 'video/mp4');

        fs.createReadStream(videopath).pipe(res);
    }
};
