import mongoose from 'mongoose';
require('dotenv').config();

const connectionURL=process.env.MONGODB_KEY

const mongoConnect = () => {
    mongoose.connect(connectionURL,{
        usenewUrlParser:true,
        useUnifiedTopology: true,
    })
    mongoose.connection
        .once('open',() =>console.log('Database connected successfully'))
        .on('error', (error) => {
            console.log('Error',error);
        })
}

export default mongoConnect;
