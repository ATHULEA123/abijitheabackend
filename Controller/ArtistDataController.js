
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const ArtistData = require('../Model/ArtistDataSchema');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../Public/Uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .png, and .pdf files are allowed!'), false); 
    }
  },
}).fields([
  { name: 'artimage', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'portfolio', maxCount: 1 },
]);

const getArtist = async (req, res, next) => {
  try {
    const artist = await ArtistData.findOne();
  
    
     if (!artist) {
      return res.json([]);
    
     }
    return res.status(200).json(artist);
  } catch (error) {
    next(error); 
  }
};

const createArtist = async (req, res, next) => {
  try {
    const { about } = req.body;
    let artimage = '';
    let resume = '';
    let portfolio = '';

    if (req.files['artimage']) {
      artimage = req.files['artimage'][0].filename;
    }
    if (req.files['resume']) {
      resume = req.files['resume'][0].filename;
    }
    if (req.files['portfolio']) {
      portfolio = req.files['portfolio'][0].filename;
    }

    const newArtist = new ArtistData({
      artimage,
      about,
      resume,
      portfolio,
    });

    await newArtist.save();

    return res.status(201).json({
      message: 'Artist created successfully',
      artist: {
        artimage: `http://localhost:3000/Uploads/${artimage}`,
        about,
        resume: `http://localhost:3000/Uploads/${resume}`,
        portfolio: `http://localhost:3000/Uploads/${portfolio}`,
      },
    });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

// Delete artist data
const deleteArtist = async (req, res, next) => {
  try {
    const artist = await ArtistData.findOne();
    if (!artist) {
      const error = new Error('Artist not found');
      error.statusCode = 404;
      return next(error);
    }

    const uploadsPath = path.join(__dirname, '../Public/Uploads');
    const deleteFileIfExists = async (filePath) => {
      if (fs.existsSync(filePath)) {
        try {
          await unlinkAsync(filePath);
        } catch (err) {
          throw new Error(`Error deleting file: ${filePath}`);
        }
      } else {
        console.warn('File not found:', filePath);
      }
    };

    const imagePath = path.join(uploadsPath, artist.artimage);
    const resumePath = path.join(uploadsPath, artist.resume);
    const portfolioPath = path.join(uploadsPath, artist.portfolio);

    if (artist.artimage) await deleteFileIfExists(imagePath);
    if (artist.resume) await deleteFileIfExists(resumePath);
    if (artist.portfolio) await deleteFileIfExists(portfolioPath);

    await ArtistData.findByIdAndDelete(artist._id);

    return res.status(200).json({ message: 'Artist data deleted successfully' });
  } catch (error) {
    next(error); 
  }
};
module.exports = {
  getArtist,
  createArtist,
  deleteArtist,
  fileUpload,
};
