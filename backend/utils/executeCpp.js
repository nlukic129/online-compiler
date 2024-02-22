const { promisify } = require("util");
const execPromise = promisify(require("child_process").exec);
const path = require("path");
const fs = require("fs");

const outputPath = path.join(__dirname, "../outputs/");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  const compileCommand = `g++ ${filepath} -o ${outPath}`;
  await execPromise(compileCommand);
  return ({ stdout: executeStdout } = await execPromise(outPath));
};

module.exports = {
  executeCpp,
};
