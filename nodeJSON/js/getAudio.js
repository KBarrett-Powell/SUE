const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

// GET by name
router.get('/:id', function (req, res) {
    const audiopath = path.join(__dirname, "../media/" + req.params.id);

    const stat = fs.statSync(audiopath);
    const fileSize = stat.size;
    
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', 'audio/wav');

    fs.createReadStream(audiopath).pipe(res);
})

module.exports = {
    router,
    getAudio: function getAudio(id) { 
        const audiopath = path.join(__dirname, "../media/" + id);

        const stat = fs.statSync(audiopath);
        const fileSize = stat.size;
        
        res.setHeader('Content-Length', fileSize);
        res.setHeader('Content-Type', 'audio/wav');

        fs.createReadStream(audiopath).pipe(res);
    }
};