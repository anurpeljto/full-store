require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connectDB');
const cookieParser = require('cookie-parser');

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
const authHeaders = require('./middleware/authHeaders');
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
const allowedOrigins = ['https://full-store.onrender.com', 'https://store-frontend-8dwl.onrender.com'];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(xss());

app.use(fileUpload({useTempFiles: true}))
app.use(cookieParser());


// routers
const authRouter = require('./routes/User');
const productRouter = require('./routes/Products');
const categoryRouter = require('./routes/Category');

app.use('/api/v1/auth', authRouter);
app.post('/api/v1/upload', authMiddleware, uploadProductImage);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/category', authMiddleware, categoryRouter);

app.get('/', authMiddleware, (req, res) => {
    res.send('Works');
})


//error middleware
app.use(errorHandlerMiddleware);


const PORT = process.env.PORT || 3000;
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