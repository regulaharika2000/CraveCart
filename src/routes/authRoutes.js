const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const query =
      "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)";

    db.run(query, [name, email, hashedPassword, role], function (err) {
      if (err) {
        return res.status(500).json({
          message: "User already exists",
        });
      }

      res.status(201).json({
        message: "User registered successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email=?";

  db.get(query, [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  });
});

module.exports = router;