const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs for file handling
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
      cb(new Error('Only .jpeg, .png, and .pdf files are allowed!'));
    }
  },
}).fields([
  { name: 'artimage', maxCount: 1 },    
  { name: 'resume', maxCount: 1 },   
  { name: 'portfolio', maxCount: 1 }, 
]);

const getArtist = async (req, res) => {
    try {
      const artist = await ArtistData.findOne();
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
      return res.status(200).json(artist);
    } catch (error) {
      console.error('Error fetching artist:', error);
      return res.status(500).json({ message: 'Error fetching artist', error });
    }
  };
  
  const createArtist = async (req, res) => {
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
        console.error('Error creating artist:', error);
        return res.status(500).json({ message: 'Error creating artist', error });
    }
};

const deleteArtist = async (req, res) => {
  try {
    const artist = await ArtistData.findOne();
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    if (artist.artimage) {
      const imagePath = path.join(__dirname, '../', artist.artimage);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        }
      });
    }

    if (artist.resume) {
      const resumePath = path.join(__dirname, '../', artist.resume);
      fs.unlink(resumePath, (err) => {
        if (err) {
          console.error('Error deleting resume:', err);
        }
      });
    }
    if (artist.portfolio) {
      const portfolioPath = path.join(__dirname, '../', artist.portfolio);
      fs.unlink(portfolioPath, (err) => {
        if (err) {
          console.error('Error deleting portfolio:', err);
        }
      });
    }

    await ArtistData.findByIdAndDelete(artist._id);
    return res.status(200).json({ message: 'Artist data deleted successfully' });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return res.status(500).json({ message: 'Error deleting artist', error });
  }
};

module.exports = {
  getArtist, 
  createArtist,
  deleteArtist, 
  fileUpload,
}


