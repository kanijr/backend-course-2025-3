const { program } = require("commander");
const fs = require("fs");

program
  .requiredOption("-i, --input <path>", "Path to the input JSON file")
  .option("-o, --output <path>", "Path to the output file (optional)")
  .option("-d, --display", "Display result in console (optional)");

program.parse();

const options = program.opts();

const inputPath = options.input;

let inputFile;
try {
  inputFile = fs.readFileSync(inputPath, {
    encoding: "utf8",
    flag: "r",
  });
} catch (err) {
  if (err.code === "ENOENT") {
    console.error("Cannot find input file");
  } else {
    console.error(err);
  }
  process.exit(1);
}
if (options.output) {
  const outputPath = options.output;

  fs.writeFileSync(outputPath, inputFile, {
    encoding: "utf8",
    flag: "w",
  });
}

if (options.display) {
  console.log(inputFile);
}
