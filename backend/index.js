const express = require("express");
const bodyParser = require("body-parser");

const { generateFile } = require("./utils/generateFile");
const { checkRequiredParams } = require("./utils/checkParams");
const { runParams } = require("./config/requiredParams");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.post("/run", async (req, res, next) => {
  try {
    checkRequiredParams(req.body, runParams);

    const { language, code } = req.body;
    const filePath = await generateFile(language, code);

    res.json({ filePath });
  } catch (error) {
    return next(error);
  }

  //   TODO: Run the file and send the response
});

app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: err.message || "An error occurred!",
    },
  });
});

app.listen(5000, () => {
  console.log("Listening on port 5000!");
});
