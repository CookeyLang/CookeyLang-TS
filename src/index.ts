import { promises as fs } from "fs";

import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";

import { AstPrinter } from "./debug/astprinter";
import { tokenPrinter } from "./debug/tokprinter";


async function interpretText(code: string, file: string) {
  const lex = new Lexer(code, file);
  const tokens = lex.init();

  if (lex.hasError) return;

  const psr = new Parser(tokens, file);
  const tree = psr.init();

  if (psr.hasError) return;

  const ipt = new Interpreter(tree);
  let result = ipt.init();
  
  console.log(result);

  return result;
}

async function interpretDebug(file: string) {
  const code = await fs.readFile(file, "utf-8");

  const lex = new Lexer(code, file);
  const tokens = lex.init();

  if (lex.hasError) return;
  console.log(tokenPrinter(tokens));

  const psr = new Parser(tokens, file);
  const trees = psr.init();

  if (psr.hasError) return;
  const astprnt = new AstPrinter(trees);
  console.log(astprnt.init());

  const ipt = new Interpreter(trees);
  let result = ipt.init();

  return result;
}

async function interpretFile(file: string) {
  const code = await fs.readFile(file, "utf-8");
  return interpretText(code, file);
}

export { interpretText, interpretDebug, interpretFile };