const express = require("express");
const upload = require('../Config/Multer')
const router = express.Router();
const {createArtwork,getAllArtworks,getArtworkById,deleteArtwork,updateArtwork} = require('../Controller/ArtworkController')


router.route("/getallart").get(getAllArtworks);
router.route("/getart/:id").get(getArtworkById);

router.post('/postart', upload,createArtwork);

router.route("/deleteart/:id").delete(deleteArtwork);
router.route("/updateart/:id").put(updateArtwork);





module.exports = router
