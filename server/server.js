import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { init, getDatabase } from './database.js';
import createGamesRoutes from './routes/games.js';
import createApkRoutes from './routes/apks.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

init();

const db = getDatabase();

app.use('/api/games', createGamesRoutes(db));
app.use('/api/apks', createApkRoutes(db));

app.get('/', (req, res) => {
  res.json({
    message: 'Game Config API Server',
    version: '1.0.0',
    endpoints: {
      games: '/api/games',
      apks: '/api/apks'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`  - GET    /api/games`);
  console.log(`  - GET    /api/games/:id`);
  console.log(`  - POST   /api/games`);
  console.log(`  - PUT    /api/games/:id`);
  console.log(`  - DELETE /api/games/:id`);
  console.log(`  - GET    /api/games/:id/files`);
  console.log(`  - POST   /api/games/:id/files`);
  console.log(`  - PUT    /api/games/:id/files/:fileId`);
  console.log(`  - DELETE /api/games/:id/files/:fileId`);
  console.log(`  - GET    /api/games/:id/submit-history`);
  console.log(`  - POST   /api/games/:id/submit-history`);
  console.log(`  - GET    /api/apks`);
});

export default app;
