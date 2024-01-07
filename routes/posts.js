const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

const queryPostgres = async (query = "SELECT * FROM posts") => {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    return result.rows;
}

router.get("/", async (req, res) => {
  try {
    const results = await queryPostgres();
    if (results.length == 0) {
        res.send({ message : "Table is empty."});
    } else {
        res.send(results);
    }
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const results = await queryPostgres(`SELECT * FROM posts WHERE id = ` + req.params.id);
    if (results.length == 0) {
        res.send({ message : "Row is not found, pleaes try another id."});
    } else {
        res.send(results);
    }
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

module.exports = router;
