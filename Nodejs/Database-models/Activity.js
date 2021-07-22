const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const Activity = new Schema({

    creatorId: {
        type: String,
        required: true,
    },
    activityId: {
        type: String,
        required: true,
        unique: true
    },
    startAddress: {
        type: Object,
        required: true

    },
    finishAddress: {
        type: Object,
        required: true
    },

    waypoints: {
        type: Array,
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    finishTime: {
        type: Date,
        default: moment().format()
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    userList: {
        type: Array
    }

});

module.exports = mongoose.model('activity', Activity);