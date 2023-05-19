const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const sqliteDb = require("../db/setup-sqlite-db");

const db = sqliteDb.db;

// POST /notes
router.post("/", (req, res) => {
  const { title, content, expirationDate } = req.body;
  const createdDate = new Date();
  const done = false;

  let sql = `INSERT INTO Notes (title, content, createdDate, expirationDate, done) VALUES (?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [title, content, createdDate, expirationDate, done],
    function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// GET /notes
router.get("/", (req, res) => {
  let sql = `SELECT * FROM Notes`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

// GET /notes/:id
router.get("/:id", (req, res) => {
  let sql = `SELECT * FROM Notes WHERE id = ?`;

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(row);
  });
});

// PUT /notes/:id
router.put("/:id", (req, res) => {
  const { title, content, done } = req.body;

  let sql = `UPDATE Notes SET title = ?, content = ?, done = ? WHERE id = ?`;

  db.run(sql, [title, content, done, req.params.id], function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ changes: this.changes });
  });
});

// DELETE /notes/:id
router.delete("/:id", (req, res) => {
  let sql = `DELETE FROM Notes WHERE id = ?`;

  db.run(sql, [req.params.id], function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ changes: this.changes });
  });
});

module.exports = router;
