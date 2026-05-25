const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../../database/delivery.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log("Database connection error", err);
  } else {
    console.log("SQLite Connected");
  }
});

module.exports = db;