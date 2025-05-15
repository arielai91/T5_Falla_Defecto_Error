import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import db from './db.js'; // Asegúrate de exportar `db` correctamente en db.js

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));

// Fallo: No se sanitizan las entradas desde el cliente, puede venir inyectado el html
// Error: No maneja de forma correcta errores de conexión a la base de datos o consultas
// Error: No se maneja la sesión de forma segura, no se verifica si el usuario ya está autenticado
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!req.session.attempts) req.session.attempts = 0;
  if (req.session.attempts >= 3) {
    return res.send('Has excedido el número de intentos.');
  }

  // Verifica si el usuario existe en la base de datos
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) return res.send('Error en el servidor');
    if (row) {
      req.session.attempts = 0;
      res.send('Inicio de sesión exitoso.');
    } else {
      req.session.attempts++;
      res.send(`Credenciales incorrectas. Intentos restantes: ${3 - req.session.attempts}`);
    }
  });
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
