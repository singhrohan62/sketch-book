import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// File Imports
import dotenv from 'dotenv-flow';
import users from './routes/api/UsersAPI.js';
import sketchAPIs from './routes/api/SketchAPI.js';
import cors from 'cors';

dotenv.config();

const app = express();

// BodyParser middleware
app.use(bodyParser.json());

// Cors middleware
app.use(cors());

// DB Config
const db = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDb connected...'))
  .catch((err) => console.error(err));

// Define routes
app.use('/api/users', users);

app.use('/api/sketches', sketchAPIs);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port: ${port}`));
