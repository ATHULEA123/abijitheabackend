

const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage }).array('artImage', 10); 

module.exports = upload;





