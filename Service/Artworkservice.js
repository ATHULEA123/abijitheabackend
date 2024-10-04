
const Art = require('../Model/PortofolioSchema');

const cloudinary = require('cloudinary').v2; // Import Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const createArt = async (artData) => {
  const { artname, arttype, artimage, medium, artsize, year, description, exhibition, location,artvedio } = artData;
  if (!artname || !arttype || !artimage || !medium || !year || !description ||!exhibition ||! artvedio) {
    throw new Error('All fields are mandatory');
  }
  const newArt = await Art.create({
    artname,
    arttype,
    artimage, 
    medium,
    artsize,
    year,
    description,
    exhibition,
    location,
    artvedio
  });
  return newArt;
};


const getAllArtworks = async () => {
    const artworks = await Art.find().sort({ createdAt: -1 });; 
    return artworks;
  };


const getArtworkById = async (id) => {
    const artwork = await Art.findById(id); 
    if (!artwork) {
      throw new Error('Artwork not found');
    }
    return artwork;
  };

const deleteArtwork = async (id) => {
  const artwork = await Art.findById(id);
  if (!artwork) {
    throw new Error('Artwork not found');
  }
  const deleteImagePromises = artwork.artimage.map((imageUrl) => {
    const publicId = imageUrl.split('/').pop().split('.')[0]; 
    return cloudinary.uploader.destroy(`artworks/${publicId}`);
  });

  await Promise.all(deleteImagePromises);

  await Art.findByIdAndDelete(id);

  return artwork;
};


  const updateArtwork = async (id, artData) => {
    const { artname, arttype, artimage, medium, artsize, year, description, exhibition, location } = artData;
  
    const updatedArt = await Art.findByIdAndUpdate(
      id,
      {
        artname,
        arttype,
        artimage,  
        medium,
        artsize,
        year,
        description,
        exhibition,
        artvedio,
        location
      },
      { new: true }  
    );
  
    if (!updatedArt) {
      throw new Error('Artwork not found');
    }
  
    return updatedArt;
  };
  
  
module.exports = {
  createArt,getAllArtworks,getArtworkById,deleteArtwork,updateArtwork
};

