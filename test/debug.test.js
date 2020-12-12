const { AstPrinter } = require("../dist/debug/astprinter");
const { tokenPrinter } = require("../dist/debug/tokprinter");

const { Lexer } = require("../dist/lexer");
const { Parser } = require("../dist/parser");


describe("Debugger", () => {
  test("token printer", () => {
    const lex = new Lexer("5_+3_", "unknown");
    const tok = lex.init();

    expect(lex.hasError).toBe(false);
    expect(tokenPrinter(tok)).toBe(`== LEXER ==
<FILE> [ LINE : COL ] << TYPE >> "VALUE"
<unknown> [ 1 : 2 ] << NUMBER >> "5"
<unknown> [ 1 : 3 ] << PLUS >> "no value"
<unknown> [ 1 : 5 ] << NUMBER >> "3"
<unknown> [ 1 : 6 ] << END >> "no value"
== REXEL ==`);
  });

  test("ast printer", () => {
    const lex = new Lexer("5_+3_", "unknown");
    const tok = lex.init();

    expect(lex.hasError).toBe(false);

    const psr = new Parser(tok, "unknown");
    const tree = psr.init();

    expect(psr.hasError).toBe(false);

    const astprnt = new AstPrinter(tree);
    expect(astprnt.init()).toBe(`== PARSER ==
(PLUS 5 3)
== RESRAP ==`);
  })
});