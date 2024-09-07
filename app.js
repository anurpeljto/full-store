require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connectDB');


// routers
const authRouter = require('./routes/User');
app.use(express.json());
app.use('/api/v1/auth', authRouter);

//middleware
const rateLimiter = require('express-rate-limit');
const authMiddleware = require('./middleware/auth');


app.get('/', authMiddleware, (req, res) => {
    res.send('Works');
})


const PORT = 3000 || process.env.PORT;
const start = async() => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log('Server is listening on port ', PORT)
        })
    } catch (error) {
        console.log('Error while starting server, ', error);
    }
}

start();