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
};

router.get("/", async (req, res) => {
  try {
    const results = await queryPostgres();
    if (results.length == 0) {
      res.send({ message: "Table is empty.", success: true });
    } else {
      res.send(results);
    }
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const results = await queryPostgres(
      `SELECT * FROM posts WHERE id = ` + req.params.id
    );
    if (results.length == 0) {
      res.send({
        message: "Row is not found, pleaes try another id.",
        success: false,
      });
    } else {
      res.send(results);
    }
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  try {
    await queryPostgres(
      "INSERT INTO posts (title, content) VALUES('" +
        req.body.title +
        "', '" +
        req.body.content +
        "');"
    );
    res.send({ message: "Row has been added", success: true });
  } catch (err) {
    res.send(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    await queryPostgres(
      "UPDATE posts SET title = '" +
        req.body.title +
        "', " +
        "content = '" +
        req.body.content +
        "'" +
        "WHERE id = " +
        req.params.id
    );
    res.send({ message: "Row has been updated", success: true });
  } catch (err) {
    res.send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await queryPostgres("DELETE FROM posts WHERE id = " + req.params.id);
    res.send({ message: "Row has been deleted", success: true });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
