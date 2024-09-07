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
const fileUpload = require('express-fileupload');
const uploadProductImage = require('./controllers/uploadsController');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

app.set('trust proxy', 1);
app.use(rateLimiter({
    windowsMs: 15*60*1000,
    max:100
}));

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(fileUpload({useTempFiles: true}))


// routers
const authRouter = require('./routes/User');
app.use('/api/v1/auth', authRouter);
app.post('/api/upload', uploadProductImage);

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