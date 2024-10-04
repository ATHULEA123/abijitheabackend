const express = require('express');
const { deleteArtist, getArtist,createArtist, fileUpload } = require('../Controller/ArtistDataController'); 
const router = express.Router();

router.post('/artist', fileUpload, createArtist);

router.get('/artist', getArtist);
router.delete('/artist', deleteArtist);

module.exports = router;
