#!/usr/bin/env node
const chalk = require("chalk");
const fs = require("fs");
const readline = require("readline");

const error = chalk.bold.red;
const warning = chalk.keyword("orange");

const [, , ...args] = process.argv;

const editFile = file => {
  const rl = readline.createInterface({
    input: fs.createReadStream(file)
  });

  const lines = [];
  rl.on("line", line => {
    const lineParts = line.split("%3a");
    if (lineParts.length > 1) {
      lineParts[0] = lineParts[0].replace(
        "1:1:0:0:0",
        `${lineParts[4]}:${lineParts[5]}:${lineParts[6]}:${lineParts[7]}:${
          lineParts[8]
        }`
      );
    }
    lines.push(lineParts.join("%3a"));
  });

  rl.on("close", () => {
    const output = fs.createWriteStream(`${file}_ready`);
    output.once("open", () => {
      lines.forEach(line => {
        output.write(`${line}\n`);
      });
    });
  });
};

if (args.length === 1) {
  if (fs.existsSync(args[0])) {
    editFile(args[0]);
  } else console.log("file " + error(args[0]) + " not found");
} else
  console.log(
    "./iptvBouquet2Epg.js " + error("file") + " as only parameter is required"
  );
