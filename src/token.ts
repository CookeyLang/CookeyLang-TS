enum TType {
  // reserved
  VAR, FINAL, DELETEVARIABLE,
  FUNCTION, RET, EXIT, LAMBDA,
  CLASS, THIS, EXTENDS, SUPERCLASS,
  NAV, TRUE, FALSE,
  IF, EL,
  AND, OR,
  FOREACH, FOR, FORREP, IN, WHILE, BREAK, DO,
  SWITCH, CASE, DEFAULT,

  // literals
  NUMBER, IDENTIFIER, STRING,

  // operators
  PLUS_EQ, PLUS_PLUS, PLUS,
  MINUS_EQ, MINUS_MINUS, MINUS,
  TIMES_EQ, TIMES,
  DIVIDE_EQ, DIVIDE,
  POWER_EQ, POWER,
  MODULO_EQ, MODULO,
  BANG_EQ, BANG,
  EQ_EQ, EQ,
  GREATER_EQ, GREATER,
  LESS_EQ, LESS,

  // symbols
  SEMI, COMMA, DOT, AT,
  LEFT_PAREN, RIGHT_PAREN, LEFT_BRACK, RIGHT_BRACK, LEFT_BRACE, RIGHT_BRACE,
  QUE, COL,

  // end of file
  END
};

class Token {
  line: number; col: number;
  type: TType;
  value: literal; file: string;

  constructor(line: number, col: number, file: string, type: TType, value: literal) {
    this.line = line, this.col = col, this.file = file, this.type = type, this.value = value;
  }
}

const defualtToken = new Token(0, 0, "<native>", TType.FINAL, ""); // so we don't have to write out debugging symbols
function identifierToken(name: string) { return new Token(0, 0, "<native>", TType.IDENTIFIER, name); }

export { Token, TType, defualtToken, identifierToken };