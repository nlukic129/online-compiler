const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { generateFile } = require("./utils/generateFile");
const { checkRequiredParams } = require("./utils/checkParams");
const { executeCpp } = require("./utils/executeCpp");
const { runParams } = require("./config/requiredParams");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.post("/run", async (req, res, next) => {
  try {
    checkRequiredParams(req.body, runParams);

    const { language, code } = req.body;
    const filePath = await generateFile(language, code);
    const output = await executeCpp(filePath);

    res.json({ filePath, output });
  } catch (error) {
    const { stderr, message } = error;
    if (stderr) {
      error.message = message.split("error:")[1];
      error.status = 400;
    }
    return next(error);
  }
});

app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: err.message.replace(/\s+/g, " ") || "An error occurred!",
    },
  });
});

app.listen(5000, () => {
  console.log("Listening on port 5000!");
});
