const { program, InvalidOptionArgumentError } = require("commander");
const fs = require("fs");

program
  .requiredOption("-i, --input <path>", "Path to the input JSON file")
  .option("-o, --output <path>", "Path to the output file (optional)")
  .option("-d, --display", "Display result in console (optional)")
  .option("-h, --humidity", "Includer humidity (optional)")
  .option(
    "-r, --rainfall <number>",
    "Filter records with Rainfall greater than this value (optional)",
    (value) => {
      if (value.trim() === "") {
        throw new InvalidOptionArgumentError("Argument must be a number");
      }
      const parsed = Number(value);
      if (Number.isNaN(parsed)) {
        throw new InvalidOptionArgumentError("Argument must be a number");
      }
      return parsed;
    }
  );

program.parse();
const options = program.opts();

const inputPath = options.input;

let inputFile;
try {
  inputFile = fs.readFileSync(inputPath, { encoding: "utf8", flag: "r" });
} catch (err) {
  if (err.code === "ENOENT") {
    console.error("Cannot find input file");
  } else {
    console.error(err);
  }
  process.exit(1);
}

let data;
try {
  data = inputFile
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
} catch (err) {
  console.error(`File "${inputPath}" is not valid JSON file`);
  process.exit(1);
}

data = data.map(({ Rainfall, Pressure3pm, Humidity3pm }) => {
  const obj = { Rainfall, Pressure3pm };
  if (options.humidity) {
    obj.Humidity3pm = Humidity3pm;
  }
  return obj;
});

if (options.rainfall) {
  const rainFallMin = options.rainfall;
  data = data.filter(({ Rainfall }) => Number(Rainfall) > rainFallMin);
}

if (options.output) {
  const outputPath = options.output;
  res = data
    .map(
      ({ Rainfall, Pressure3pm, Humidity3pm }) =>
        "" +
        Rainfall +
        " " +
        Pressure3pm +
        (options.humidity ? " " + Humidity3pm : "")
    )
    .join("\n");

  fs.writeFileSync(outputPath, res, { encoding: "utf8", flag: "w" });
}

if (options.display) {
  data.forEach(({ Rainfall, Pressure3pm, Humidity3pm }) =>
    console.log(Rainfall, Pressure3pm, options.humidity ? Humidity3pm : "")
  );
}
