const { promisify } = require("util");
const execPromise = promisify(require("child_process").exec);
const path = require("path");

const executePy = async (filepath) => {
  const compileCommand = `python ${filepath}`;
  return ({ stdout: executeStdout } = await execPromise(compileCommand));
};

module.exports = {
  executePy,
};
