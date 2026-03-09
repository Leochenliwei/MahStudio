import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { init, getDatabase } from './database.js';
import createGamesRoutes from './routes/games.js';
import createApkRoutes from './routes/apks.js';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4174;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

init();

const db = getDatabase();

// API 路由
app.use('/api/games', createGamesRoutes(db));
app.use('/api/apks', createApkRoutes(db));

// 静态文件服务 - 托管 dist 目录
const distPath = path.join(__dirname, '../dist');

// 为 /MahStudio 路径提供静态文件服务
app.use('/MahStudio', express.static(distPath));

// 根路径重定向到 /MahStudio
app.get('/', (req, res) => {
  res.redirect('/MahStudio');
});

// 所有 /MahStudio/ 下的非文件请求都返回 index.html（支持前端路由）
app.use('/MahStudio', (req, res, next) => {
  // 如果请求的是静态文件（有扩展名），让 express.static 处理
  if (req.path.includes('.')) {
    return next();
  }
  // 否则返回 index.html
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
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
