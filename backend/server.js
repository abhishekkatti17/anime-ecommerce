const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Needed on Render so session cookies work behind its proxy
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_only_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Serve the frontend from the same server
app.use(express.static(path.join(__dirname, '../frontend')));

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10
});

// Register
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hashedPass], (err) => {
      if (err) return res.status(500).send("Error registering");
      res.send("User registered");
    });
  } catch (e) {
    res.status(500).send("Error registering");
  }
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).send("Login error");
    if (results.length === 0) return res.status(401).send("User not found");

    const match = await bcrypt.compare(password, results[0].password);
    if (match) {
      // Store only what you need, never the password hash
      req.session.user = {
        id: results[0].id,
        username: results[0].username,
        email: results[0].email
      };
      res.redirect('/home.html');
    } else {
      res.status(401).send("Incorrect password");
    }
  });
});

// Save cart to DB
app.post('/add-to-cart', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).send("Login required");

  const cart = req.body.cart;
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).send("Cart should be a non-empty array");
  }

  const values = cart.map(item => [
    userId, item.id, item.name, item.price, item.quantity, item.image
  ]);

  const sql = `
    INSERT INTO cart (user_id, product_id, product_name, price, quantity, image)
    VALUES ?`;

  db.query(sql, [values], (err) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Failed to save cart");
    }
    res.send("Cart saved to database");
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));