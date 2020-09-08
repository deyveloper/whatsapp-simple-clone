// Imports
const express = require('express')
const mongoose = require('mongoose')
const cors  = require('cors')
const Pusher = require('pusher')
const apiV1Router = require('./routes/apiv1')

// App config
const app = express()
const db = mongoose.connection
// Environment variables
const PORT = process.env.PORT || 5000
// Pusher
const PUSHER_ID = process.env.PUSHER_ID
const PUSHER_KEY = process.env.PUSHER_KEY
const PUSHER_SECRET = process.env.PUSHER_SECRET
const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER || 'eu'
const PUSHER_ENCRYPTED = process.env.PUSHER_ENCRYPTED || true
// MongoDB
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_CLUSTER = process.env.MONGO_CLUSTER
const MONGO_DB_NAME = process.env.MONGO_DB_NAME

const pusher = new Pusher({
  appId: PUSHER_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
  encrypted: PUSHER_ENCRYPTED
});

db.once('open', () => {
    console.log("DB Connected")

    const msgCollection = db.collection('messages')
    const changeStream = msgCollection.watch()

    changeStream.on('change', (change) => {
        console.log(change)
        
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        } else {
            console.log('Error triggering Pusher');
        }
    })
})

// Middlewares
app.use(express.json())
app.use(cors())
app.use('/api/v1/', apiV1Router)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

// DB Config
const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.yyvkz.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(connectionString, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// ????

// Api routes
app.get('/', (req, res) => {
    res.status(200).send("Hello world")
})


// Listen
app.listen(PORT, () => {
    console.log(`Listening on port - ${PORT}`);
})