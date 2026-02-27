import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'game_config.db');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unique_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      region TEXT,
      collaborators TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_by TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS game_files (
      id TEXT PRIMARY KEY,
      game_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      content TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      updated_by TEXT,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS submit_history (
      id TEXT PRIMARY KEY,
      game_id INTEGER NOT NULL,
      draft_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      created_by TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS apk_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      apk_id INTEGER NOT NULL UNIQUE,
      apk_name TEXT NOT NULL
    );
  `);
}

function importMockGames() {
  try {
    const existingCount = db.prepare('SELECT COUNT(*) as count FROM games').get().count;
    if (existingCount > 0) {
      console.log(`Games table already has ${existingCount} records, skipping import`);
      return;
    }

    const mockGames = [
      {
        id: 1,
        unique_id: 'fsiodlfhjlsdfnsldkf==',
        name: '麻城痞子杠',
        description: '麻城地区特色麻将玩法',
        region: '湖北省/黄冈市/麻城市',
        collaborators: ['王一博', '江安明', '杨孙怡'],
        created_by: 'admin',
        created_at: '2026-02-01T10:30:00',
        updated_by: 'admin',
        updated_at: '2026-02-01T14:20:00'
      },
      {
        id: 2,
        unique_id: 'unique-2-abc123',
        name: '通用麻将',
        description: '标准通用麻将规则',
        region: '',
        collaborators: [],
        created_by: 'admin',
        created_at: '2026-02-02T09:00:00',
        updated_by: 'admin',
        updated_at: '2026-02-03T16:45:00'
      },
      {
        id: 3,
        unique_id: 'unique-3-def456',
        name: '香港麻将',
        description: '香港地区特色麻将玩法',
        region: '',
        collaborators: [],
        created_by: 'admin',
        created_at: '2026-02-03T08:00:00',
        updated_by: 'admin',
        updated_at: '2026-02-03T08:00:00'
      }
    ];
    
    const insertGame = db.prepare(`
      INSERT INTO games (unique_id, name, description, region, collaborators, created_by, created_at, updated_by, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertFile = db.prepare(`
      INSERT INTO game_files (id, game_id, type, name, content, created_at, updated_at, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertManyGames = db.transaction((games) => {
      for (const game of games) {
        const gameId = insertGame.run(
          game.unique_id,
          game.name,
          game.description || '',
          game.region || '',
          JSON.stringify(game.collaborators || []),
          game.created_by || '',
          game.created_at,
          game.updated_by || '',
          game.updated_at
        ).lastInsertRowid;

        const defaultDraft = {
          id: `draft-${gameId}`,
          game_id: gameId,
          type: 'draft',
          name: '默认草稿',
          content: '{}',
          created_at: game.created_at,
          updated_at: game.updated_at,
          updated_by: game.updated_by || ''
        };

        insertFile.run(
          defaultDraft.id,
          gameId,
          defaultDraft.type,
          defaultDraft.name,
          defaultDraft.content,
          defaultDraft.created_at,
          defaultDraft.updated_at,
          defaultDraft.updated_by
        );
      }
    });

    insertManyGames(mockGames);
    console.log(`Imported ${mockGames.length} games`);
  } catch (error) {
    console.error('Error importing mock games:', error.message);
  }
}

function importApkList() {
  const apkidJsonPath = path.join(__dirname, '..', '资料', 'apkid.json');
  if (!fs.existsSync(apkidJsonPath)) {
    console.log('apkid.json not found, skipping APK data import');
    return;
  }

  try {
    const existingCount = db.prepare('SELECT COUNT(*) as count FROM apk_list').get().count;
    if (existingCount > 0) {
      console.log(`apk_list table already has ${existingCount} records, skipping import`);
      return;
    }

    const apkData = JSON.parse(fs.readFileSync(apkidJsonPath, 'utf-8'));
    
    const insertApk = db.prepare(`
      INSERT INTO apk_list (apk_id, apk_name)
      VALUES (?, ?)
    `);

    const insertManyApks = db.transaction((data) => {
      if (data.data && Array.isArray(data.data)) {
        for (const apk of data.data) {
          insertApk.run(apk.apk_id, apk.apk_name_cn);
        }
      }
    });

    insertManyApks(apkData);
    console.log(`Imported ${apkData.count || apkData.data?.length || 0} APKs from apkid.json`);
  } catch (error) {
    console.error('Error importing APK list:', error.message);
  }
}

function init() {
  console.log('Initializing database...');
  initializeDatabase();
  importMockGames();
  importApkList();
  console.log('Database initialization complete');
}

function getDatabase() {
  return db;
}

export { init, getDatabase };
