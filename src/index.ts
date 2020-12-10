import * as fs from "fs/promises";
import { Lexer } from "./lexer";

async function interpretText(code: string, file: string) {
  const lex = new Lexer(code, file);
  lex.init();

  if (lex.hasError) return;
  console.log(lex.tokens);
}

async function interpretFile(file: string) {
  const code = await fs.readFile(file, "utf-8");
  return interpretText(code, file);
}

export { interpretText, interpretFile };