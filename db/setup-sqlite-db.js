const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../db/notes.db");

let db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
  }
);

function createTable() {
  db.run(
    `CREATE TABLE IF NOT EXISTS Notes(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT UNIQUE,
          content TEXT,
          createdDate TEXT,
          expirationDate TEXT,
          done BOOLEAN)`,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("notes table ready");
      }
    }
  );
}

module.exports = { createTable, db };
