import { Token, TType } from "./token";

class Lexer {
  private code: string;
  private file: string;
  hasError = false;

  private line = 1; col = 1;
  private i = 0;

  private tokens: Token[] = [];
  private reserved: { [i: string]: TType } = {
    // Variables
    "var": TType.VAR, "final": TType.FINAL, "deleteVariable": TType.DELETEVARIABLE,

    // Functions
    "function": TType.FUNCTION, "ret": TType.RET, "exit": TType.EXIT, "lambda": TType.LAMBDA,

    // Classes
    "class": TType.CLASS, "this": TType.THIS, "extends": TType.EXTENDS, "superClass": TType.SUPERCLASS,

    // Values
    "NaV": TType.NAV, "true": TType.TRUE, "false": TType.FALSE,

    // If Statements
    "if": TType.IF, "el": TType.EL,

    // Logic
    "and": TType.AND, "or": TType.OR,

    // Loops
    "foreach": TType.FOREACH, "for": TType.FOR, "forrep": TType.FORREP, "in": TType.IN, "while": TType.WHILE, "break": TType.BREAK, "do": TType.DO,

    // Switch
    "switch": TType.SWITCH, "case": TType.CASE, "default": TType.DEFAULT
  };

  constructor(code: string, file: string) {
    this.code = code;
    this.file = file;
  }

  init() {
    while (this.isValid()) {
      // shebang
      if (this.i == 0 && this.curr() == "#" && this.peek() == "!") {
        this.next(); // #
        this.next(); // !
        while (this.curr() != '\n') {
          this.next();
        }
      }

      // number
      if (this.isNumber(this.curr())) {
        let number = this.curr();
        while (this.isValid() && (this.isNumber(this.peek()) || this.peek() == '_')) {
          this.next();
          if (this.curr() != '_') number += this.curr();
        }

        if (this.peek() == '.') {
          this.next(); // .
          number += this.curr();

          while (this.isValid() && (this.isNumber(this.peek()) || this.peek() == '_')) {
            this.next();
            if (this.curr() != '_') number += this.curr();
          }
        }

        this.append(TType.NUMBER, Number(number));
      } else if (this.isAlpha(this.curr())) { // identifier
        let text = this.curr();

        while (this.isValid() && this.isAlphaNum(this.peek())) {
          this.next();
          text += this.curr();
        }

        if (this.reserved[text] != null) this.append(this.reserved[text], text);
        else this.append(TType.IDENTIFIER, text);
      } else {
        const char = this.curr();
        switch (char) {
          case '(': this.append(TType.LEFT_PAREN); break;
          case ')': this.append(TType.RIGHT_PAREN); break;
          case '{': this.append(TType.LEFT_BRACE); break;
          case '}': this.append(TType.RIGHT_BRACE); break;

          case ',': this.append(TType.COMMA); break;
          case '.': this.append(TType.DOT); break;
          case ';': this.append(TType.SEMI); break;
          case '@': this.append(TType.AT); break;

          case '?': this.append(TType.QUE); break;
          case ':': this.append(TType.COL); break;

          case '-': this.match('=') ? this.append(TType.MINUS_EQ) : this.append(TType.MINUS); break;
          case '+': this.match('=') ? this.append(TType.PLUS_EQ) : this.append(TType.PLUS); break;
          case '*': this.match('=') ? this.append(TType.TIMES_EQ) : this.append(TType.TIMES); break;
          case '/': this.match('=') ? this.append(TType.DIVIDE_EQ) : this.append(TType.DIVIDE); break;
          case '^': this.match('=') ? this.append(TType.POWER_EQ) : this.append(TType.POWER); break;

          case '!': this.match('=') ? this.append(TType.BANG_EQ) : this.append(TType.BANG); break;
          case '=': this.match('=') ? this.append(TType.EQ_EQ) : this.append(TType.EQ); break;

          case '>': this.match('=') ? this.append(TType.GREATER_EQ) : this.append(TType.GREATER); break;
          case '<': this.match('=') ? this.append(TType.LESS_EQ) : this.append(TType.LESS); break;

          case '%':
            if (this.match('%')) {
              while (this.isValid() && this.peek() != '\n') this.next();
            } else if (this.match('*')) {
              while (this.isValid() && !(this.peek() == '*' && this.code[this.i + 2] == '%')) {
                if (this.curr() == '\n') this.newline();
                else this.next();
              }

              if (this.peek() != '*' && this.code[this.i + 2] != "%") {
                this.error("Unterminated multi-line comment.");
              } else {
                this.next(); // *
                this.next(); // %
              }
            }
            else if (this.match('=')) this.append(TType.MODULO_EQ);
            else this.append(TType.MODULO);
            break;

          case '"':
          case '\'': {
            let strtype = this.curr();
            let text = "";
            while (this.isValid() && this.peek() != strtype) {
              if (this.curr() == '\n') this.newline();
              else this.next();

              // escape sequences
              if (this.curr() == '\\') {
                let next = this.peek();
                this.newline();
                switch (next) {
                  case '\'':
                    text += '\'';
                    break;

                  case '"':
                    text += '"';
                    break;

                  case 'r':
                    text += '\r';
                    break;

                  case 'n':
                    text += '\n';
                    break;

                  case 'm':
                    let keycode = "";
                    while (this.isValid() && this.isNumber(this.peek())) {
                      this.next();
                      keycode += this.curr();
                    }

                    text += String.fromCharCode(parseInt(keycode));
                    break;

                  case 'u':
                    if (this.peek() != '{') this.error("Expected '{' before an unicode escape code.");
                    this.next(); // {

                    let hex = "";

                    while (this.peek() != '}') {
                      this.next();
                      hex += this.curr();
                    }

                    if (this.peek() != '}') this.error("Expected '}' after an unicode escape code.");
                    this.next();

                    text += String.fromCharCode(parseInt(hex, 16));
                    break;

                  case 'e':
                    text += '\x1b';
                    break;

                  case '0':
                    text += '\0';
                    break;

                  case '\\':
                    text += '\\';
                    break;
                  
                  case '\n':
                    // ignore newlines
                    break;

                  default:
                    this.error(`Invalid escape sequence '${this.curr()}'.`);
                }
              } else text += this.curr();
            }

            if (this.peek() != strtype) {
              this.error("Unterminated string.");
            }

            this.next(); // "

            this.append(TType.STRING, text);
          } break;

          case ' ':
          case '\r':
          case '\t':
            // ignore whitespace
            break;

          case '\n':
            this.newline();
            continue; // avoid skipping next char

          default:
            this.error(`Unexpected character ${char}.`);
            break;
        }
      }

      this.next();
    }

    this.append(TType.END);

    return this.tokens;
  }


  private append(type: TType, value: literal = "") {
    this.tokens.push(new Token(this.line, this.col, this.file, type, value));
  }

  private isValid() {
    return this.i < this.code.length;
  }


  private isNumber(c: string) {
    return c >= '0' && c <= '9';
  }

  private isAlpha(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
  }

  private isAlphaNum(c: string) {
    return this.isNumber(c) || this.isAlpha(c);
  }


  private error(message: string) {
    this.hasError = true;
    console.log(`<${this.file}> [ ${this.line} : ${this.col} ] ${message}`);
  }


  private curr() {
    return this.code[this.i];
  }

  private peek() {
    return this.code[this.i + 1];
  }

  private match(char: string) {
    if (!this.isValid()) return false;
    if (this.code[this.i + 1] != char) return false;

    this.next();
    return true;
  }

  private next() {
    this.i++;
    this.col++;
  }

  private newline() {
    this.i++;
    this.line++;
    this.col = 1;
  }
}

export { Lexer };