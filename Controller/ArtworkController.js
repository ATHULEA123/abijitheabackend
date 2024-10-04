const artService = require('../Service/Artworkservice');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
const createArtwork = async (req, res) => {
  try {
      const artData = req.body;
      const files = req.files;
      console.log(files);
      if (!files || files.length === 0) {
          throw new Error('No files uploaded');
      }
      const uploadPromises = files.map(file => {
          return new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                  {
                      folder: 'artworks', 
                      public_id: file.originalname.split('.')[0]
                  },
                  async (error, result) => {
                      if (error) {
                          return reject(error);
                      }
                      const optimizedUrl = cloudinary.url(result.public_id, {
                          fetch_format: 'auto',
                          quality: 'auto'
                      });
                      const autoCropUrl = cloudinary.url(result.public_id, {
                          crop: 'auto',
                          gravity: 'auto',
                          width: 500,
                          height: 500,
                      });
                      resolve({
                          original: result.secure_url,
                          optimized: optimizedUrl,
                          autoCropped: autoCropUrl
                      });
                  }
              );
              streamifier.createReadStream(file.buffer).pipe(uploadStream);
          });
      });

      const imageResults = await Promise.all(uploadPromises);
      const artImages = imageResults.map(result => result.original);
      console.log(artImages);
      
      const newArt = await artService.createArt({
          ...artData,
          artimage: artImages
      });

      res.status(201).json(newArt);
  } catch (error) {
      console.error(error.message);
      res.status(400).json({ message: error.message });
  }
};


const getAllArtworks = async (req, res) => {
    try {
      const artworks = await artService.getAllArtworks();
      res.status(200).json(artworks);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error, unable to fetch artworks' });
    }
  };


const getArtworkById = async (req, res) => {
    try {
      const { id } = req.params; 
      const artwork = await artService.getArtworkById(id);
      res.status(200).json(artwork);
    } catch (error) {
      console.error(error.message);
      res.status(404).json({ message: error.message });
    }
  };

const deleteArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    await artService.deleteArtwork(id);
    res.status(200).json({ message: 'Artwork and associated images deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};

const updateArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const artData = req.body;
    const files = req.files;
  console.log(files);
  console.log(artData);
    const existingArt = await artService.getArtworkById(id,artData);
    if (!existingArt) {
      throw new Error('Artwork not found');
    }
    let updatedImages = existingArt.artimage; 
    if (files && files.length > 0) {
     
      const deletePromises = existingArt.artimage.map(publicId => cloudinary.uploader.destroy(publicId));
      await Promise.all(deletePromises);
      const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'artworks', 
              public_id: file.originalname.split('.')[0] 
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result.public_id); 
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });
      updatedImages = await Promise.all(uploadPromises);
    }
              
    const updatedArt = await artService.updateArtwork(id, { ...artData, artimage: updatedImages });
    res.status(200).json(updatedArt);

  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

  
  



module.exports = {
  createArtwork,getAllArtworks,getArtworkById,deleteArtwork,updateArtwork
};