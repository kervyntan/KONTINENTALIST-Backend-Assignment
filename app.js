var express = require("express");
var app = express();

app.use(express.json());

require("dotenv").config();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

app.listen(2000, function () {
  console.log("Example app listening on port 2000!");
});
