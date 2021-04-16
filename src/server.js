import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import './database/index.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(3003, () => console.log('Server up on port 3003.'));