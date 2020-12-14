const { Token, TType } = require("../dist/token");
const { Lexer } = require("../dist/lexer");
const { Parser } = require("../dist/parser");
const { AstPrinter } = require("../dist/debug/astprinter");
const Expr = require("../dist/expr/expr");


describe("Parser", () => {
  test("ast printer", () => {
    // (PLUS (MINUS 3) 4)
    const tree = [new Expr.Binary(
      new Expr.Unary(new Token(0, 0, '', TType.MINUS, ''), new Expr.Literal(new Token(0, 0, '', TType.NUMBER, 3), 3)),
      new Token(0, 0, '', TType.PLUS, ''),
      new Expr.Literal(new Token(0, 0, '', TType.NUMBER, 4), 4)
    )];

    expect(new AstPrinter(tree).init()).toBe(`== PARSER ==
(PLUS (MINUS 3) 4)
== RESRAP ==`);
  });

  test("math parser", () => {
    // (PLUS (TIMES 3 2) (TIMES ((PLUS 5 6)) 3))
    const lex = new Lexer("3 * 2 + (5 + 6) * 3;", 'unknown');
    const tokens = lex.init();

    expect(lex.hasError).toBe(false);

    const txt = new Parser(tokens, 'unknown').init();

    expect(new AstPrinter(txt).init()).toBe(`== PARSER ==
(PLUS (TIMES 3 2) (TIMES ((PLUS 5 6)) 3));
== RESRAP ==`);
  });
});