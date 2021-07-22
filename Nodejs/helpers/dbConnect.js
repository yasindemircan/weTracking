const mongoose = require('mongoose');

const mongo_database_local = 'mongodb://localhost:27017/TrackingApp';

module.exports = () => {
    mongoose.connect(mongo_database_local,{ useNewUrlParser: true ,useUnifiedTopology: true ,useFindAndModify:true, useCreateIndex:true,});

    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
    });

    mongoose.Promise = global.Promise;
};