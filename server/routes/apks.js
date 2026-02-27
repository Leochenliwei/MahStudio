import express from 'express';
const router = express.Router();

function createApkRoutes(db) {
  
  router.get('/', (req, res) => {
    try {
      const apks = db.prepare(`
        SELECT * FROM apk_list ORDER BY apk_id ASC
      `).all();

      res.json(apks);
    } catch (error) {
      console.error('Error fetching APKs:', error);
      res.status(500).json({ error: 'Failed to fetch APKs' });
    }
  });

  return router;
}

export default createApkRoutes;
