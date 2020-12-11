import * as fs from "fs/promises";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";
import { AstPrinter } from "./debug/astprinter";

async function interpretText(code: string, file: string) {
  const lex = new Lexer(code, file);
  const tokens = lex.init();

  if (lex.hasError) return;

  const psr = new Parser(tokens, file);
  const tree = psr.init();

  if (psr.hasError) return;

  const printer = new AstPrinter(tree);
  // const ipt = new Interpreter(tree);
  console.log(printer.init());
  // console.log(ipt.init())
}

async function interpretFile(file: string) {
  const code = await fs.readFile(file, "utf-8");
  return interpretText(code, file);
}

export { interpretText, interpretFile };