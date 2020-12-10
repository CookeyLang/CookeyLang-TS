#!/usr/bin/env node
import { interpretFile } from "../index";

if (process.argv.length != 3) {
  console.log("<CookeyLang> You must provide one input file!");
  console.log("<CookeyLang> Usage: cookeylang <file>");

  process.exit(1);
}

interpretFile(process.argv[2]);