const mongoose = require("mongoose")

const APISchema = new mongoose.Schema({
    rateLimit: {
        type: Number,
        default: 2
    },
    lastTimeCalled: {
        type: Date,
        default: Date.now
    },
    call: {
        type: String,
        default: 0
    },
    callLogs: []

})

module.exports = mongoose.model('ApiModel', APISchema)