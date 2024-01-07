const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized : false
  }
});

router.get("/", (req, res) => {
    console.log("hey")
    res.send({ success: true })
});

router.get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM posts");
    const results = {
      results: result ? result.rows : null,
    };
    console.log(results);
    client.release();
    res.send({ success: true })
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

module.exports = router;
