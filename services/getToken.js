const knex = require("../lib/knexConfig");
const z = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let getToken = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input Validation using Zod
    try {
      z.string().email({ message: "Invalid email format" }).parse(email);
      z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .parse(password);
    } catch (validationError) {
      return res.status(400).json({
        error: validationError.errors?.[0]?.message || "Invalid input data",
      });
    }

    // Fetch user from the database
    let user;
    try {
      user = await knex("users")
        .select("id", "username", "email", "password")
        .where("email", email)
        .first();
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ error: "Database error during login" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    try {
      const token = jwt.sign(
        {
          userid: user.id,
          useremail: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET
      );

      // Return the token
      res.status(200).json({ message: "User login successful", token });
    } catch (jwtError) {
      console.error("JWT generation error:", jwtError);
      res
        .status(500)
        .json({ error: "Failed to generate authentication token" });
    }
  } catch (err) {
    // Generic error handling for unexpected issues
    console.error("Login error:", err);
    res
      .status(500)
      .json({ error: "User login failed due to an internal error" });
  }
};

module.exports = getToken;
