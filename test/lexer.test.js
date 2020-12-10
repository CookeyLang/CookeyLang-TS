const { Lexer } = require("../dist/lexer");
const { Token } = require("../dist/token");


describe("Lexer", () => {
  test("strings", () => {
    const lex = new Lexer(`"str"
'str'
'test\\'\\"\\r\\n
\\m69
\\u{69}
\\e\\\\
'
"test\\'\\"\\r\\n
\\m69
\\u{69}
\\e\\\\
"`, "unknown"); lex.init();

    expect(lex.hasError).toBe(false);
    expect(lex.tokens.length).toBe(5);
  });

  test("errors", () => {
    const lex = new Lexer(`"`, "unknown"); lex.init();

    expect(lex.hasError).toBe(true);
    expect(lex.tokens.length).toBe(2); // failed string, eof
  });

  test("numbers", () => {
    const lex = new Lexer(`1.23\n1`, "unknown"); lex.init();

    expect(lex.hasError).toBe(false);
    expect(lex.tokens).toEqual([ new Token(1, 4, 'unknown', 28, 1.23), new Token(2, 1, 'unknown', 28, 1), new Token(2, 2, 'unknown', 65, '') ]);
  });

  test("reserved", () => {
    const lex = new Lexer(`var\nvariable`, "unknown"); lex.init();

    expect(lex.hasError).toBe(false);
    expect(lex.tokens).toEqual([ new Token(1, 3, 'unknown', 0, 'var'), new Token(2, 8, 'unknown', 29, 'variable'), new Token(2, 9, 'unknown', 65, '') ]);
  });
});