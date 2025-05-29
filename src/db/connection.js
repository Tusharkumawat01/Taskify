// NodeJS SQLite connection using better-sqlite3 for Electron/Node environments

const Database = require("better-sqlite3");
const path = require("path");

// Store the DB file in the project root as db.sqlite
const db = new Database(path.resolve(__dirname, "db.sqlite"));

// Export the db object for queries and initialization
module.exports = db;