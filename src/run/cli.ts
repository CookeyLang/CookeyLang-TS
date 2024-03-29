#!/usr/bin/env node
import { interpretFile, repl } from "../index";

if (process.argv.length == 2) {
  repl();
} else if (process.argv.length == 3) {
  interpretFile(process.argv[2], true);
} else {
  console.log("<CookeyLang> You must provide one input file!");
  console.log("<CookeyLang> Usage: cookeylang <file>");

  process.exit(1);
}