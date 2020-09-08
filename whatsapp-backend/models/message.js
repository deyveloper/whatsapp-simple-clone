const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: {
        type: Date,
        default: Date.now
    },
    received: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Message', MessageSchema)