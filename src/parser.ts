import { Base } from "./expr/base";
import * as Expr from "./expr/expr";
import { TType, Token } from "./token";

class Parser {
  private i = 0;
  private tokens: Token[] = [];
  private file: string;

  constructor(tokens: Token[], file: string) {
    this.file = file;
    this.tokens = tokens;
  }

  init() {
    return this.expression();
  }


  private expression() {
    return this.equality();
  }

  private equality() {
    let expr: Base = this.comparison();

    while (this.match(TType.EQ_EQ, TType.BANG_EQ)) {
      let op: Token = this.previous();
      let right: Base = this.comparison();
      expr = new Expr.Binary(expr, op, right);
    }

    return expr;
  }

  private comparison() {
    let expr: Base = this.addition();

    while (this.match(TType.GREATER, TType.GREATER_EQ, TType.LESS, TType.LESS_EQ)) {
      let op: Token = this.previous();
      let right: Base = this.addition();
      expr = new Expr.Binary(expr, op, right);
    }

    return expr;
  }

  private addition() {
    let expr: Base = this.multiplication();

    while (this.match(TType.PLUS, TType.MINUS)) {
      let op: Token = this.previous();
      let right: Base = this.multiplication();
      expr = new Expr.Binary(expr, op, right);
    }

    return expr;
  }

  private multiplication() {
    let expr: Base = this.unary();

    while (this.match(TType.DIVIDE, TType.TIMES)) {
      let op: Token = this.previous();
      let right: Base = this.unary();
      expr = new Expr.Binary(expr, op, right);
    }

    return expr;
  }

  private unary() {
    if (this.match(TType.BANG_EQ, TType.MINUS)) {
      let op: Token = this.previous();
      let right: Base = this.unary();
      return new Expr.Unary(op, right);
    }

    return this.primary();
  }

  private primary(): Base {
    if (this.match(TType.FALSE)) return new Expr.Literal(this.previous(), false);
    if (this.match(TType.TRUE)) return new Expr.Literal(this.previous(), true);
    if (this.match(TType.NAV)) return new Expr.Literal(this.previous(), null);

    if (this.match(TType.NUMBER, TType.STRING)) {
      return new Expr.Literal(this.previous(), this.previous().value);
    }

    if (this.match(TType.LEFT_PAREN)) {
      let expr: Base = this.expression();
      this.consume(TType.RIGHT_PAREN, "Expected a ')' after expression.");
      return new Expr.Grouping(expr);
    }

    return new Base();
  }


  private isValid() {
    return this.i < this.tokens.length;
  }

  private match(...tokens: TType[]) {
    for (const token of tokens) {
      if (this.isValid() && this.tokens[this.i].type == token) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private advance() {
    if (this.isValid()) this.i++;
    return this.previous();
  }

  private previous() {
    return this.tokens[this.i - 1];
  }

  private consume(type: TType, error: string) {
    if (this.match(type)) return this.previous();

    console.log("ERROR TODO!", error);
    // todo: error
  }
}

export { Parser };