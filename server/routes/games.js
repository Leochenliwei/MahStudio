import express from 'express';
const router = express.Router();

function createGamesRoutes(db) {
  
  router.get('/', (req, res) => {
    try {
      const games = db.prepare(`
        SELECT * FROM games ORDER BY id DESC
      `).all();

      const gamesWithDetails = games.map(game => {
        const files = db.prepare(`
          SELECT * FROM game_files WHERE game_id = ?
        `).all(game.id);

        const submitHistory = db.prepare(`
          SELECT * FROM submit_history WHERE game_id = ? ORDER BY created_at DESC
        `).all(game.id);

        return {
          ...game,
          collaborators: game.collaborators ? JSON.parse(game.collaborators) : [],
          files,
          submitHistory
        };
      });

      res.json(gamesWithDetails);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ error: 'Failed to fetch games' });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const game = db.prepare(`
        SELECT * FROM games WHERE id = ?
      `).get(req.params.id);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const files = db.prepare(`
        SELECT * FROM game_files WHERE game_id = ?
      `).all(game.id);

      const submitHistory = db.prepare(`
        SELECT * FROM submit_history WHERE game_id = ? ORDER BY created_at DESC
      `).all(game.id);

      res.json({
        ...game,
        collaborators: game.collaborators ? JSON.parse(game.collaborators) : [],
        files,
        submitHistory
      });
    } catch (error) {
      console.error('Error fetching game:', error);
      res.status(500).json({ error: 'Failed to fetch game' });
    }
  });

  router.post('/', (req, res) => {
    try {
      const { name, description, region, collaborators, createdBy } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const uniqueId = `unique-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const result = db.prepare(`
        INSERT INTO games (unique_id, name, description, region, collaborators, created_by, created_at, updated_by, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uniqueId,
        name,
        description || '',
        region || '',
        JSON.stringify(collaborators || []),
        createdBy || 'admin',
        now,
        createdBy || 'admin',
        now
      );

      const newGame = db.prepare(`
        SELECT * FROM games WHERE id = ?
      `).get(result.lastInsertRowid);

      res.status(201).json({
        ...newGame,
        collaborators: newGame.collaborators ? JSON.parse(newGame.collaborators) : [],
        files: [],
        submitHistory: []
      });
    } catch (error) {
      console.error('Error creating game:', error);
      res.status(500).json({ error: 'Failed to create game' });
    }
  });

  router.put('/:id', (req, res) => {
    try {
      const { name, description, region, collaborators, updatedBy } = req.body;
      const now = new Date().toISOString();

      const existingGame = db.prepare(`
        SELECT * FROM games WHERE id = ?
      `).get(req.params.id);

      if (!existingGame) {
        return res.status(404).json({ error: 'Game not found' });
      }

      db.prepare(`
        UPDATE games 
        SET name = ?, description = ?, region = ?, collaborators = ?, updated_by = ?, updated_at = ?
        WHERE id = ?
      `).run(
        name || existingGame.name,
        description !== undefined ? description : existingGame.description,
        region !== undefined ? region : existingGame.region,
        collaborators !== undefined ? JSON.stringify(collaborators) : existingGame.collaborators,
        updatedBy || 'admin',
        now,
        req.params.id
      );

      const updatedGame = db.prepare(`
        SELECT * FROM games WHERE id = ?
      `).get(req.params.id);

      const files = db.prepare(`
        SELECT * FROM game_files WHERE game_id = ?
      `).all(req.params.id);

      const submitHistory = db.prepare(`
        SELECT * FROM submit_history WHERE game_id = ? ORDER BY created_at DESC
      `).all(req.params.id);

      res.json({
        ...updatedGame,
        collaborators: updatedGame.collaborators ? JSON.parse(updatedGame.collaborators) : [],
        files,
        submitHistory
      });
    } catch (error) {
      console.error('Error updating game:', error);
      res.status(500).json({ error: 'Failed to update game' });
    }
  });

  router.delete('/:id', (req, res) => {
    try {
      const existingGame = db.prepare(`
        SELECT * FROM games WHERE id = ?
      `).get(req.params.id);

      if (!existingGame) {
        return res.status(404).json({ error: 'Game not found' });
      }

      db.prepare(`
        DELETE FROM games WHERE id = ?
      `).run(req.params.id);

      res.json({ success: true, message: 'Game deleted successfully' });
    } catch (error) {
      console.error('Error deleting game:', error);
      res.status(500).json({ error: 'Failed to delete game' });
    }
  });

  router.get('/:id/files', (req, res) => {
    try {
      const game = db.prepare(`
        SELECT * FROM games WHERE id = ?
      `).get(req.params.id);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const files = db.prepare(`
        SELECT * FROM game_files WHERE game_id = ? ORDER BY created_at DESC
      `).all(req.params.id);

      res.json(files);
    } catch (error) {
      console.error('Error fetching game files:', error);
      res.status(500).json({ error: 'Failed to fetch game files' });
    }
  });

  router.post('/:id/files', (req, res) => {
    try {
      const game = db.prepare(`
        SELECT * FROM games WHERE id = ?
      `).get(req.params.id);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const { type, name, content, updatedBy } = req.body;
      
      if (!type || !name) {
        return res.status(400).json({ error: 'Type and name are required' });
      }

      const fileId = `${type}-${Date.now()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO game_files (id, game_id, type, name, content, created_at, updated_at, updated_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        fileId,
        req.params.id,
        type,
        name,
        content || '{}',
        now,
        now,
        updatedBy || 'admin'
      );

      const newFile = db.prepare(`
        SELECT * FROM game_files WHERE id = ?
      `).get(fileId);

      res.status(201).json(newFile);
    } catch (error) {
      console.error('Error creating game file:', error);
      res.status(500).json({ error: 'Failed to create game file' });
    }
  });

  router.put('/:id/files/:fileId', (req, res) => {
    try {
      const existingFile = db.prepare(`
        SELECT * FROM game_files WHERE id = ? AND game_id = ?
      `).get(req.params.fileId, req.params.id);

      if (!existingFile) {
        return res.status(404).json({ error: 'File not found' });
      }

      const { type, name, content, updatedBy } = req.body;
      const now = new Date().toISOString();

      db.prepare(`
        UPDATE game_files 
        SET type = ?, name = ?, content = ?, updated_at = ?, updated_by = ?
        WHERE id = ? AND game_id = ?
      `).run(
        type || existingFile.type,
        name || existingFile.name,
        content !== undefined ? content : existingFile.content,
        now,
        updatedBy || 'admin',
        req.params.fileId,
        req.params.id
      );

      const updatedFile = db.prepare(`
        SELECT * FROM game_files WHERE id = ?
      `).get(req.params.fileId);

      res.json(updatedFile);
    } catch (error) {
      console.error('Error updating game file:', error);
      res.status(500).json({ error: 'Failed to update game file' });
    }
  });

  router.delete('/:id/files/:fileId', (req, res) => {
    try {
      const existingFile = db.prepare(`
        SELECT * FROM game_files WHERE id = ? AND game_id = ?
      `).get(req.params.fileId, req.params.id);

      if (!existingFile) {
        return res.status(404).json({ error: 'File not found' });
      }

      db.prepare(`
        DELETE FROM game_files WHERE id = ? AND game_id = ?
      `).run(req.params.fileId, req.params.id);

      res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting game file:', error);
      res.status(500).json({ error: 'Failed to delete game file' });
    }
  });

  router.get('/:id/submit-history', (req, res) => {
    try {
      const game = db.prepare(`
        SELECT * FROM games WHERE id = ?
      `).get(req.params.id);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const submitHistory = db.prepare(`
        SELECT * FROM submit_history WHERE game_id = ? ORDER BY created_at DESC
      `).all(req.params.id);

      res.json(submitHistory);
    } catch (error) {
      console.error('Error fetching submit history:', error);
      res.status(500).json({ error: 'Failed to fetch submit history' });
    }
  });

  router.post('/:id/submit-history', (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Request params:', req.params);
      
      const game = db.prepare(`
        SELECT * FROM games WHERE id = ?
      `).get(req.params.id);

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const { draftId, targetType, createdBy } = req.body;
      
      console.log('Extracted from body:', { draftId, targetType, createdBy });
      
      if (!draftId || !targetType) {
        return res.status(400).json({ error: 'draftId and targetType are required' });
      }

      const historyId = `submit-${Date.now()}`;
      const now = new Date().toISOString();

      console.log('Inserting submit history with params:', {
        historyId,
        gameId: req.params.id,
        draftId,
        targetType,
        createdBy: createdBy || 'admin',
        now
      });

      db.prepare(`
        INSERT INTO submit_history (id, game_id, draft_id, target_type, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        historyId,
        req.params.id,
        draftId,
        targetType,
        createdBy || 'admin',
        now
      );

      const newHistory = db.prepare(`
        SELECT * FROM submit_history WHERE id = ?
      `).get(historyId);

      res.status(201).json(newHistory);
    } catch (error) {
      console.error('Error creating submit history:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Failed to create submit history' });
    }
  });

  return router;
}

export default createGamesRoutes;
