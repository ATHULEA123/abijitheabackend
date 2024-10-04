// const mongoose = require('mongoose');
// const connectDb = async () =>{
//     try {
//         const connect = await mongoose.connect(process.env.CONNECTION_STRING);
//         console.log(`database is connected in :${connect.connection.host}`)
//     } catch (error) {
//         console.log(error)  
//     }
// }
// module.exports = connectDb;




//
const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1);
    }
};

module.exports = connectDb;
