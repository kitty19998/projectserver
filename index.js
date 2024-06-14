import express from 'express';
import dotenv from "dotenv";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { userRoute } from './routes/userRoutes.js';
import { residencyRoute } from './routes/residencyRoute.js';
dotenv.config()

const app = express();

const PORT  = process.env.PORT ;
const MONGODB_URI= process.env.DATABASE_URL;

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.get('/', (req, res) => {
    res.send('Hello, this is the Real Estate Application Server!');
});

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log('Welcome to the Real Estate Application Server');
});



app.use('/api/user', userRoute)
app.use("/api/residency", residencyRoute) //ctrl + space to import automatically
