const express = require("express");
const getToken = require("./services/getToken");
const userSignup = require("./services/userSignup");
const userDelete = require("./services/userDelete");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//Registers new users in database
app.post("/signup", userSignup);

//Generates and returns JWT tokens
app.post("/gettoken", getToken);

app.post("/deleteusers", userDelete);
