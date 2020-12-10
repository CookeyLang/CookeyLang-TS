import * as fs from "fs/promises";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

async function interpretText(code: string, file: string) {
  const lex = new Lexer(code, file);
  const tokens = lex.init();

  if (lex.hasError) return;

  const psr = new Parser(tokens, file);
  const tree = psr.init();
}

async function interpretFile(file: string) {
  const code = await fs.readFile(file, "utf-8");
  return interpretText(code, file);
}

export { interpretText, interpretFile };