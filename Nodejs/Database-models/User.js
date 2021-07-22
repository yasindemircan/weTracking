const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const User = new Schema({

    name: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: true,
    },
    surname: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
    },
    email: {
        type: String,
        minLength: 7,
        maxLength: 60,
        required:true,
        unique:true,
    },
    password: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
    },
    forgetpassword: {
        type: String,
        default: false
    },
    role:{
        type: Number,
        default: 3,
    },
  
});

module.exports = mongoose.model('user',User);