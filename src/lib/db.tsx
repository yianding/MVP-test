import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize database
async function initializeDB() {
  return open({
    filename: './tasks.db',
    driver: sqlite3.Database
  });
}

// Create tables if they don't exist
async function setupDatabase() {
  const db = await initializeDB();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'in-progress', 'completed')),
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  
  return db;
}

export const dbPromise = setupDatabase();