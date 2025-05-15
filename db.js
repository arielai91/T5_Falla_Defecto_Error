import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)");
  // Defecto: Contraseña en texto plano, no se debe guardar así
  db.run("INSERT INTO users (username, password) VALUES ('AM@gmail.com', '1234')");
  db.run("INSERT INTO users (username, password) VALUES ('LO@gmail.com', '12345')");
});

export default db;