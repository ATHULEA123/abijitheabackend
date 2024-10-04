const mongoose = require('mongoose');

const ArtistData = new mongoose.Schema({
  artimage: {
    type: String,
  },
  about: {
    type: String,
  },
  resume: {
    type: String, 
  },
  portfolio: {
    type: String, 
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model("ArtistData", ArtistData);
