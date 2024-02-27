const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { generateFile } = require("./utils/generateFile");
const { checkRequiredParams } = require("./utils/checkParams");
const { executeCpp } = require("./utils/executeCpp");
const { executePy } = require("./utils/executePy");
const { runParams } = require("./config/requiredParams");
const { mongoURI, mongoOptions } = require("./config/dbConfig");
const Job = require("./models/Job");

mongoose
  .connect(mongoURI, mongoOptions)
  .then(() => {
    console.log("Successfully connected to MongoDB database!");
  })
  .catch((err) => console.error("Error connecting MongoDB database:", err));

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.post("/run", async (req, res, next) => {
  let job;
  try {
    checkRequiredParams(req.body, runParams);

    const { language, code } = req.body;
    const filePath = await generateFile(language, code);

    job = await new Job({ language, filePath }).save();
    const jobId = job["_id"];

    res.status(201).json({ success: true, jobId });

    let output;

    job["startedAt"] = new Date();

    if (language === "cpp") {
      output = await executeCpp(filePath);
    } else {
      output = await executePy(filePath);
    }

    job["competedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output.stdout;

    await job.save();
  } catch (error) {
    const { stderr, message } = error;
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = message;
    await job.save();
    if (stderr) {
      error.message = message;
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
