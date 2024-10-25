const express = require('express');
const path = require('path');
const connectDb = require('./Config/Dbconnection');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorhandler');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

connectDb();
app.use(cors()); 
app.use(bodyParser.json({ limit: '30mb' })); 
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));


app.use('/Uploads', express.static(path.join(__dirname, 'Public/Uploads')));

// Route setup
app.use('/', require('./Routes/ArtworkRoute'));
app.use('/art', require('./Routes/ArtistRoute'));

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


