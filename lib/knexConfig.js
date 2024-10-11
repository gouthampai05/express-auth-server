require("dotenv").config();
const knex = require("knex");

// Check if required environment variables are set
const requiredEnvVars = [
  "MYSQL_HOST",
  "MYSQL_PORT",
  "MYSQL_USER",
  "MYSQL_PASSWORD",
  "MYSQL_DATABASE",
  "JWT_SECRET",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const knexConfig = {
  client: "mysql2",
  connection: {
    host: String(process.env.MYSQL_HOST),
    port: String(process.env.MYSQL_PORT),
    user: String(process.env.MYSQL_USER),
    password: String(process.env.MYSQL_PASSWORD),
    database: String(process.env.MYSQL_DATABASE),
  },
  pool: {
    min: 1, // Minimum number of connections in the pool
    max: 10, // Maximum number of connections in the pool
  },
};

const db = knex(knexConfig);
module.exports = db;
