const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getPool } = require("../db/setup-ms-sql-db");
const sql = require("mssql");

// ! POST /users/register ================================
router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const pool = await getPool();
    const request = pool.request();
    const result = await request
      .input("name", sql.VarChar, name)
      .input("hashedPassword", sql.VarChar, hashedPassword)
      .input("salt", sql.VarChar, salt).query(`
        INSERT INTO users_table (name, hashed_password, password_salt)
        OUTPUT INSERTED.id
        VALUES (@name, @hashedPassword, @salt)
      `);

    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ! POST /users/login ================================
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const pool = await getPool();
    const request = pool.request();
    const result = await request
      .input("name", sql.VarChar, name)
      .query(`SELECT * FROM users_table WHERE name = @name`);

    const user = result.recordset[0];
    if (!user)
      return res.status(400).json({ error: "Invalid username or password" });

    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: user.id }, "place_env_jwt_secret_here");
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ! POST /users/logout ================================
router.post("/logout", (req, res) => {
  // clear jwt on the client side
  res.json({ message: "Logout successful" });
});

// ! GET /users/score ================================
router.get("/score/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const request = pool.request();
    const result = await request
      .input("id", sql.Int, id)
      .query(`SELECT score FROM users_table WHERE id = @id`);

    const user = result.recordset[0];
    if (!user) return res.status(400).json({ error: "User not found" });

    res.json({ score: user.score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ! PUT /users/score ================================
router.put("/score/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const request = pool.request();
    const result = await request
      .input("id", sql.Int, id)
      .query(
        `UPDATE users_table SET score = score + 1 OUTPUT INSERTED.* WHERE id = @id`
      );

    console.log(result);
    // Check if any rows were affected by the UPDATE query
    if (result.rowsAffected[0] === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    res.json({ score: result.recordset[0].score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// * export router ======================================
module.exports = router;
