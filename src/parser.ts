import { Base } from "./expr/base";
import * as Stmt from "./expr/stmt";
import * as Expr from "./expr/expr";

import { TType, Token, defualtToken } from "./token";


class Parser {
  private i = 0;
  private tokens: Token[] = [];
  private file: string;
  hasError = false;

  constructor(tokens: Token[], file: string) {
    this.file = file;
    this.tokens = tokens;
  }

  init() {
    let stmts: Base[] = [];

    while (this.isValid()) {
      stmts.push(this.decl());
    }

    return stmts;
  }


  private decl() {
    if (this.match(TType.VAR, TType.FINAL)) return this.varDecl();

    return this.stmt();
  }

  private varDecl() {
    let mut = this.previous();
    let name = this.consume(TType.IDENTIFIER, "Expected a variable name.");

    let value: Base | null = null;
    if (this.match(TType.EQ)) value = this.expression();
    this.consume(TType.SEMI, "Expected a ';' after variable declaration.");

    if (value == null && mut.type == TType.FINAL) this.error("Constants require a value");

    return new Stmt.VarDecl(mut, name!, value!);
  }

  private stmt() {
    if (this.match(TType.IF)) return this.ifStmt();
    if (this.match(TType.WHILE)) return this.whileStmt();
    if (this.match(TType.DO)) return this.doWhileStmt();
    if (this.match(TType.FOR)) return this.forStmt();
    if (this.match(TType.EXIT)) return this.exitStmt();
    if (this.match(TType.LEFT_BRACE)) return new Stmt.Block(this.block());

    return this.exprStmt();
  }

  private exprStmt() {
    let expr = this.expression();

    this.consume(TType.SEMI, "Expected ';' after expression");
    return new Stmt.ExprStmt(expr);
  }

  private ifStmt(): Base {
    this.consume(TType.LEFT_PAREN, "Expected '(' after if keyword.");
    let condition = this.expression();
    this.consume(TType.RIGHT_PAREN, "Expected ')' after if condition.");

    let thenBr = this.stmt();
    let elseBr: Base | null = null;
    if (this.match(TType.EL)) elseBr = this.stmt();

    return new Stmt.IfStmt(condition, thenBr, elseBr);
  }

  private whileStmt(): Base {
    this.consume(TType.LEFT_PAREN, "Expected '(' after while keyword.");
    let condition = this.expression();
    this.consume(TType.RIGHT_PAREN, "Expected ')' after condition.");
    let body = this.stmt();

    return new Stmt.WhileStmt(condition, body);
  }

  private doWhileStmt(): Base {
    let body = this.stmt();

    this.consume(TType.WHILE, "Expected 'while' after statement.");
    this.consume(TType.LEFT_PAREN, "Expected '(' after 'while' keyword.");
    let condition = this.expression();
    this.consume(TType.RIGHT_PAREN, "Expected ')' after expression.");
    this.consume(TType.SEMI, "Expected ';' after ')'");

    return new Stmt.Block([ body, new Stmt.WhileStmt(condition, body) ]);
  }

  private forStmt(): Base {
    this.consume(TType.LEFT_PAREN, "Expected '(' after 'for' keyword.");

    let initializer: Base | null;
    if (this.match(TType.SEMI)) initializer = null;
    else if (this.match(TType.VAR)) initializer = this.varDecl();
    else initializer = this.exprStmt();

    let condition: Base | null = null;
    if (!this.match(TType.SEMI)) condition = this.expression();
    this.consume(TType.SEMI, "Expected ';' after for loop condition.");

    let increment: Base | null = null;
    if (!this.match(TType.SEMI)) increment = this.expression();
    this.consume(TType.RIGHT_PAREN, "Expected ')' after for loop clauses.");

    let body = this.stmt();

    // i++;
    if (increment) body = new Stmt.Block([body, new Stmt.ExprStmt(increment)]);

    // i < 5;
    if (condition == null) condition = new Expr.Literal(body.lineData, true);
    body = new Stmt.WhileStmt(condition, body);

    // i = 0;
    if (initializer) body = new Stmt.Block([initializer, body]);

    return body;
  }

  private exitStmt() {
    let num: Base = new Expr.Literal(this.previous(), 0);
    if (!this.match(TType.SEMI)) num = this.expression();

    this.consume(TType.SEMI, "Expected ';' after exit.");
    return new Stmt.ExitStmt(num);
  }

  private block() {
    let stmts: Base[] = [];

    while (this.isValid() && this.peek().type != TType.RIGHT_BRACE) {
      stmts.push(this.decl());
    }

    this.consume(TType.RIGHT_BRACE, "Expected '}' after block.");
    return stmts;
  }


  private expression() {
    return this.assignment();
  }

  private assignment(): Base {
    let expr = this.logicOr();

    if (this.match(TType.EQ)) {
      let value = this.assignment();

      if (expr instanceof Expr.Variable) {
        let name = expr.name;
        return new Expr.Assign(name, value);
      }

      this.error("Invalid assignment target.");
    }

    return expr;
  }

  private logicOr() {
    let expr = this.logicAnd();

    while (this.match(TType.OR)) {
      let op = this.previous();
      let right = this.logicAnd();
      expr = new Expr.Logic(expr, op, right);
    }

    return expr;
  }

  private logicAnd() {
    let expr = this.equality();

    while (this.match(TType.AND)) {
      let op = this.previous();
      let right = this.equality();
      expr = new Expr.Logic(expr, op, right);
    }

    return expr;
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
    let expr: Base = this.power();

    while (this.match(TType.DIVIDE, TType.TIMES, TType.MODULO)) {
      let op: Token = this.previous();
      let right: Base = this.power();
      expr = new Expr.Binary(expr, op, right);
    }

    return expr;
  }

  private power() {
    let expr: Base = this.unary();

    while (this.match(TType.POWER)) {
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

    return this.call();
  }

  private call() {
    let expr = this.primary();
    
    while (true) {
      if (this.match(TType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  private finishCall(callee: Base) {
    let args = [];
    if (this.peek().type != TType.RIGHT_PAREN) {
      do {
        args.push(this.expression());
      } while (this.match(TType.COMMA));
    }

    let paren = this.consume(TType.RIGHT_PAREN, "Expected ')' after arguments.")!;

    return new Expr.Call(callee, paren, args);
  }

  private primary(): Base {
    if (this.match(TType.FALSE)) return new Expr.Literal(this.previous(), false);
    if (this.match(TType.TRUE)) return new Expr.Literal(this.previous(), true);
    if (this.match(TType.NAV)) return new Expr.Literal(this.previous(), null as literal);

    if (this.match(TType.NUMBER, TType.STRING)) {
      return new Expr.Literal(this.previous(), this.previous().value);
    }

    if (this.match(TType.LEFT_PAREN)) {
      let expr: Base = this.expression();
      this.consume(TType.RIGHT_PAREN, "Expected a ')' after expression.");
      return new Expr.Grouping(expr);
    }

    if (this.match(TType.IDENTIFIER)) return new Expr.Variable(this.previous());

    this.error(`Unexpected token ${TType[this.peek().type]}.`);
    return new Base(defualtToken);
  }


  private isValid() {
    return this.i < this.tokens.length && this.peek().type != TType.END;
  }

  private match(...tokens: TType[]) {
    for (const token of tokens) {
      if (this.isValid() && this.peek().type == token) {
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

  private peek() {
    return this.tokens[this.i];
  }

  private consume(type: TType, message: string) {
    if (this.match(type)) return this.previous();

    this.error(message);
  }

  private error(message: string) {
    this.hasError = true;
    console.log(`<${this.file}> [ ${this.tokens[this.i].line} : ${this.tokens[this.i].col} ] ${message}`);
    this.synchronize();
  }

  private synchronize() {
    this.advance(); // the erroneous token

    while (this.isValid()) {
      if (this.previous().type == TType.SEMI) return;

      switch (this.peek().type) {
        case TType.CLASS:
        case TType.FUNCTION:
        case TType.LAMBDA:
        case TType.VAR:
        case TType.FINAL:
        case TType.DELETEVARIABLE:
        case TType.FOR:
        case TType.WHILE:
        case TType.FOREACH:
        case TType.FORREP:
        case TType.SWITCH:
        case TType.IF:
        case TType.RET:
        case TType.EXIT:
        case TType.BREAK:
          return;
      }

      this.advance();
    }
  }
}

export { Parser };