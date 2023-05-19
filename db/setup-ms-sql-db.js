const sql = require("mssql");

const config = {
  user: "sa",
  password: "AdminPassword1",
  server: "localhost",
  database: "forget_me_notes",
  options: {
    encrypt: false,
  },
  port: 1433,
};

const getPool = async () => await sql.connect(config);

async function createTable() {
  try {
    let pool = await getPool();
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users_table' and xtype='U')
        CREATE TABLE users_table (
          id INT PRIMARY KEY IDENTITY,
          name VARCHAR(200) NOT NULL UNIQUE,
          hashed_password VARCHAR(255) NOT NULL,
          password_salt VARCHAR(255) NOT NULL,
          score INT NOT NULL DEFAULT 0
        );
    `);
    console.log("database setup complete.");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

module.exports = { getPool, createTable };
