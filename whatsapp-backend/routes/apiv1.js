const Message = require('../models/message')
const express = require('express')
const { response } = require('express')
const router = express.Router()


router.get('/messages/sync', (req, res) => {
    Message.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

router.post('/messages/', (req, res) => {
    const message = {
        message: req.body.message,
        name: req.body.name,
        received: req.body.received,
    }

    Message.create(message, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

module.exports = router