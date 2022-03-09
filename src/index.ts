import { promises as fs } from "fs";
import * as readline from "readline";

import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";
import { Resolver } from "./resolver";

import { AstPrinter } from "./debug/astprinter";
import { tokenPrinter } from "./debug/tokprinter";


async function interpretText(code: string, file: string, debug = false) {
  const lex = new Lexer(code, file);
  const tokens = lex.init();

  if (lex.hasError) return;
  if (debug) console.log(tokenPrinter(tokens));

  const parser = new Parser(tokens, file);
  const trees = parser.init();

  if (parser.hasError) return;
  if (debug) {
    const astprnt = new AstPrinter(trees);
    console.log(astprnt.init());
  }

  const interpreter = new Interpreter(trees);
  const resolver = new Resolver(interpreter);

  resolver.init(trees);
  if (resolver.hasError) return;

  let result = interpreter.init();
  // console.log(result);

  return result;
}

async function interpretFile(file: string, debug = false) {
  const code = await fs.readFile(file, "utf-8");
  return interpretText(code, file, debug);
}

function repl() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let code = "";
  let indentation = 0; // each { will add indentation

  console.log("CookeyLang REPL");
  console.log("Press ^C or \x1b[1mEXIT\x1b[0m to exit.");
  process.stdout.write("> ");
  rl.on("line", async inp => {
    if (inp == "EXIT") process.exit(0);
    if (inp == "{") indentation++;
    if (inp == "}" && indentation > 0) indentation--;

    code += inp;

    if (indentation == 0) {
      await interpretText(code, "repl");
      code = "";
    }

    process.stdout.write("> ");
  });
}

export { interpretText, interpretFile, repl };