require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connectDB');

// security

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


//middleware
const authMiddleware = require('./middleware/auth');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
    windowsMs: 15*60*1000,
    max:100
}));

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());


// routers
const authRouter = require('./routes/User');
app.use('/api/v1/auth', authRouter);

app.get('/', authMiddleware, (req, res) => {
    res.send('Works');
})


//error middleware
app.use(errorHandlerMiddleware);


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