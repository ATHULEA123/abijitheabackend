const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
    artname:{
        type:String,
        required:true

    },
    arttype:{
        type:String,
        required:true
    },
    artsize:{
        type:String,
        required:true
    },
    artimage:{
        type:[String],
        required:true
    },
    medium:{
        type:String,
        required:true

    },
    year:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    exhibition:{
        type:String
    },
    artvedio:{
        type:String
    },
    location:{
        type:String
    },
},
{
    timestamps:true,
});

module.exports = mongoose.model("ArtworkSchema",ArtworkSchema);