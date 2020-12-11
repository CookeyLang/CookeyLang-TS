import { Token, TType } from "../token";

function tokenPrinter(tokens: Token[]) {
  let out = tokens.map(tok => `<${tok.file}> [ ${tok.line} : ${tok.col} ] << ${TType[tok.type]} >> "${tok.value == '' || tok.value == null ? "no value" : tok.value}"`);
  return `== LEXER ==
<FILE> [ LINE : COL ] << TYPE >> "VALUE"
${out.join("\n")}
== REXEL ==`;
}

export { tokenPrinter };