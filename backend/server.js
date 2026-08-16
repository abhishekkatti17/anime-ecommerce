  // Node.js Express Serverconst express = require('express');
  const express = require('express'); // ✅ This is missing
  const mysql = require('mysql2');
  const session = require('express-session');
  const bcrypt = require('bcrypt');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  require('dotenv').config();

  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(session({
    secret: 'anime_secret',
    resave: false,
    saveUninitialized: true
  }));
  app.post('/add-to-cart', (req, res) => {
  const cart = req.body.cart;
  const userId = req.session.user?.id || 1; // TEMP default

  if (!Array.isArray(cart)) {
    return res.status(400).send("Cart should be an array");
  }

  const values = cart.map(item => [
    userId,
    item.id,
    item.name,
    item.price,
    item.quantity,
    item.image
  ]);

  const sql = `
    INSERT INTO cart (user_id, product_id, product_name, price, quantity, image)
    VALUES ?`;

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Failed to save cart");
    }
    res.send("Cart saved to database");
  });
});
  

  // MySQL Connection
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");
  });

  // Registration Route
  app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, hashedPass], (err, result) => {
      if (err) return res.status(500).send("Error registering");
      res.send("User registered");
    });
  });

  // Login Route
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).send("Login error");
      if (results.length === 0) return res.status(401).send("User not found");

      const match = await bcrypt.compare(password, results[0].password);
      if (match) {
        req.session.user = results[0];
        res.redirect('http://localhost:5500/frontend/home.html');
      } else {
        res.status(401).send("Incorrect password");
      }
    });
  });

  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  // Save Cart to DB
  app.post('/add-to-cart', (req, res) => {
    const cart = req.body.cart;
    const userId = req.session.user?.id || 1; // TEMP: default user id = 1

    if (!Array.isArray(cart)) {
      return res.status(400).send("Cart should be an array");
    }

    const values = cart.map(item => [
      userId,
      item.id,
      item.name,
      item.price,
      item.quantity,
      item.image
    ]);

    const sql = `
    INSERT INTO cart (user_id, product_id, product_name, price, quantity, image)
    VALUES ?`;
 
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).send("Failed to save cart");
      }
      res.send("Cart saved to database");
    });
  });
