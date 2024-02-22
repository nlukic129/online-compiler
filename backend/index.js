const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.post("/run", (req, res, next) => {
  const { language, code } = req.body;

  if (!language) {
    const error = new Error("Missing parameter: language");
    error.status = 400;

    return next(error);
  }

  if (!code) {
    const error = new Error("Missing parameter: code");
    error.status = 400;

    return next(error);
  }

  //   TODO: Generate c++ file with content from the request
  //   TODO: Run the file and send the response
});

app.use((err, req, res, next) => {
  res.status = err.status || 500;

  res.json({
    error: {
      message: err.message || "Error was occurred!",
    },
  });
});

app.listen(5000, () => {
  console.log("Listening on port 5000!");
});
