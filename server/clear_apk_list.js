import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'game_config.db');
const db = new Database(dbPath);

try {
  console.log('开始清空apk_list表数据...');
  
  // 删除表中所有数据
  const deleteStmt = db.prepare('DELETE FROM apk_list');
  const result = deleteStmt.run();
  
  console.log(`成功删除 ${result.changes} 条数据`);
  
  // 重置自增ID
  const resetStmt = db.prepare("DELETE FROM sqlite_sequence WHERE name = 'apk_list'");
  resetStmt.run();
  console.log('已重置自增ID');
  
} catch (error) {
  console.error('删除数据时出错:', error.message);
} finally {
  db.close();
  console.log('操作完成，数据库连接已关闭');
}