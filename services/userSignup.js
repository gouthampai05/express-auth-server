const z = require("zod");
const bcrypt = require("bcrypt");
const knex = require("../lib/knexConfig");

let userSignup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Input Validation using Zod
    try {
      z.string().parse(username);
      z.string().email({ message: "Invalid email format" }).parse(email);
      z.string()
        .min(8, {
          message: "Password must be at least 8 characters long",
        })
        .parse(password);
    } catch (validationError) {
      return res.status(400).json({
        error: validationError.errors?.[0]?.message || "Invalid input data",
      });
    }

    // Check if the email or username already exists in the database
    const existingUser = await knex("users")
      .where({ email })
      .orWhere({ username })
      .first();

    if (existingUser) {
      return res.status(409).json({
        error: "A user with this email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await knex("users").insert({ username, password: hashedPassword, email });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during user registration:", err);

    // Respond with an internal server error for unexpected issues
    res.status(500).json({
      error: "An internal server error occurred during registration",
    });
  }
};

module.exports = userSignup;
