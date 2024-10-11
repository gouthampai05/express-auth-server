const knex = require("../lib/knexConfig");
const z = require("zod");
const bcrypt = require("bcrypt");
require("dotenv").config();

let userDelete = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input Validation using Zod
    try {
      z.string().email().parse(email);
      z.string().min(8).parse(password);
    } catch (validationError) {
      return res.status(400).json({
        error: "Invalid input data",
      });
    }

    // Fetch user from the database
    let user;
    try {
      user = await knex("users")
        .select("id", "email", "password")
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

    // Delete user
    try {
      await knex("users").where("email", email).del();
      res.status(200).json({ message: "User deletion successful" });
    } catch (delErr) {
      console.error("JWT generation error:", delErr);
      res.status(500).json({ error: "Failed to delete user" });
    }
  } catch (err) {
    // Generic error handling for unexpected issues
    console.error("Deletion error:", err);
    res
      .status(500)
      .json({ error: "User deletion failed due to an internal error" });
  }
};

module.exports = userDelete;
