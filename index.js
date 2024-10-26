const express = require("express");
const app = express();
const { Client } = require("pg");
app.use(express.json());
const client = new Client({
  user: "postgres",
  host: "localhost",
  password: "Gm49302@",
  port: 5432,
  database: "bookstore",
});
client.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
// get all users
app.get("/users", async (req, res) => {
  const { rows } = await client.query(
    "SELECT userid, password, role FROM users"
  );
  res.json(rows);
});
// post a user
app.post("/postData", (req, res) => {
  const { userid, password, role } = req.body;
  const query = "insert into users (userid, password, role) values ($1,$2,$3)";
  client.query(query, [userid, password, role], (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      res.send(err);
    }
  });
});
// get element by id
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  client.query("SELECT * FROM users WHERE userId = $1 LIMIT 1", [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  });
});
app.listen(3000);
