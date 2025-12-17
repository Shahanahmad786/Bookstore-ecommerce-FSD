import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bookRoutes from './Routes/bookRoutes.js';

// after routes
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Mount API routes under /api/books
app.use('/api/books', bookRoutes);

// Serve static frontends
app.use('/classic', express.static(path.join(__dirname, 'public', 'classic')));
app.use('/optimistic', express.static(path.join(__dirname, 'public', 'optimistic')));
// root public (index linking to both frontends)
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';
const port = process.env.PORT || 3000;

mongoose.connect(mongoUri)
  .then(() => {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch(err => console.log(err));