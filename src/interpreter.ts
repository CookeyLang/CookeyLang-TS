import { finalToken, identifierToken, Token, TType } from "./token";
import { Base } from "./expr/base";
import { Visitor } from "./expr/visitor";
import * as Stmt from "./expr/stmt";
import * as Expr from "./expr/expr";

import { Environment } from "./environment";

import { CookeyError, CookeyRet } from "./errors";
import { FuncCallable, UserCallable } from "./functions";
import { CookeyClass } from "./classes";


class Interpreter extends Visitor {
  trees: Base[];
  public globals: Environment = new Environment(); // native functions and variables
  private environment: Environment; // user-defined things

  // variable: scopes between variable and definiton
  private locals: Map<Base, number> = new Map();

  constructor(trees: Base[]) {
    super();
    this.trees = trees;
    this.environment = this.globals;

    this.globals.define(finalToken, identifierToken("printLine"), new FuncCallable(1, (_, args) => console.log(this.stringify(args[0])), () => "<Native Function>"));
    this.globals.define(finalToken, identifierToken("print"), new FuncCallable(1, (_, args) => process.stdout.write(this.stringify(args[0])), () => "<Native Function>"));
    this.globals.define(finalToken, identifierToken("clearConsole"), new FuncCallable(0, () => console.clear(), () => "<Native Function>"));
  }

  init() {
    try {
      for (const tree of this.trees) {
        tree.visit(this);
      }
    } catch (e) {
      if (e instanceof CookeyError) {
        console.log(`<${e.lineData.file}> [ ${e.lineData.line} : ${e.lineData.col} ] ${e.message}`);
        if (e.calls.length > 0) for (const call of e.calls) console.log(`at <${call.file}> [ ${call.line} : ${call.col} ]`);
      }
    }
  }

  initBlock(stmts: Base[], env: Environment) {
    let parent = this.environment;
    try {
      this.environment = env;

      for (const stmt of stmts) {
        stmt.visit(this);
      }
    } finally {
      this.environment = parent;
    }
  }

  resolve(expr: Base, depth: number) {
    this.locals.set(expr, depth);
  }

  
  FuncDecl(self: Stmt.FuncDecl): literal {
    let func = new UserCallable(self, this.environment);
    this.environment.define(finalToken, self.name, func);
    return null;
  }

  ClassDecl(self: Stmt.ClassDecl) {
    this.environment.define(finalToken, self.name.value, null);
    let newClass = new CookeyClass(self.name.value);
    this.environment.define(finalToken, self.name, newClass);
  }

  VarDecl(self: Stmt.VarDecl): literal {
    let value: literal = null;
    if (self.value) value = self.value.visit(this);

    this.environment.define(self.mut, self.name, value);

    return null;
  }

  ExprStmt(self: Stmt.ExprStmt): literal {
    self.expr.visit(this);
    return null;
  }

  IfStmt(self: Stmt.IfStmt): literal {
    if (self.condition.visit(this) == true) return self.thenBr.visit(this);
    else if (self.elseBr) return self.elseBr.visit(this);
    return null;
  }

  WhileStmt(self: Stmt.WhileStmt): literal {
    while (this.isTrue(self.condition.visit(this))) {
      self.body.visit(this);
    }
    return null;
  }

  ExitStmt(self: Stmt.ExitStmt) {
    let exitCode = self.exit.visit(this);
    process.exit(exitCode);
  }

  RetStmt(self: Stmt.RetStmt) {
    let value = self.value.visit(this);
    throw new CookeyRet(value);
  }

  Block(self: Stmt.Block) {
    this.initBlock(self.stmts, new Environment(this.environment));
    return null;
  }


  Literal(self: Expr.Literal): literal {
    return self.value;
  }

  Assign(self: Expr.Assign): literal {
    let value = self.value.visit(this);

    let distance = this.locals.get(self);
    if (distance != null) this.environment.assignAt(distance, self.name, value);
    else this.environment.assign(self.name, value);
    return value;
  }

  Logic(self: Expr.Logic): literal {
    let left = self.left.visit(this);

    if (self.op.type == TType.OR) {
      if (this.isTrue(left)) return left;
    } else {
      if (!this.isTrue(left)) return left;
    }

    return self.right.visit(this);
  }

  Lambda(self: Expr.Lambda): literal {
    return new UserCallable(self, this.environment);
  }

  Binary(self: Expr.Binary): literal {
    let left: literal = self.left.visit(this);
    let right: literal = self.right.visit(this);

    switch (self.op.type) {
      case TType.PLUS:
        if (typeof left == "number" && typeof right == "number") return left + right;
        if (typeof left == "string" && typeof right == "string") return left + right;
        throw new CookeyError(self.lineData, "Only number addition or string concatenation is allowed for the '+' operator.");
      case TType.MINUS:
        if (typeof left == "number" && typeof right == "number") return left - right;
        throw new CookeyError(self.lineData, "Only numbers are allowed for the '-' operator.");
      case TType.TIMES:
        if (typeof left == "number" && typeof right == "number") return left * right;
        throw new CookeyError(self.lineData, "Only numbers are allowed for the '*' operator.");
      case TType.DIVIDE:
        if (typeof left == "number" && typeof right == "number") return left / right;
        throw new CookeyError(self.lineData, "Only numbers are allowed for the '/' operator.");
      case TType.MODULO:
        if (typeof left == "number" && typeof right == "number") return left % right;
        throw new CookeyError(self.lineData, "Only numbers are allowed for the '%' operator.");
      case TType.POWER:
        if (typeof left == "number" && typeof right == "number") return left ** right;
        throw new CookeyError(self.lineData, "Only numbers are allowed for the '^' operator.");

      case TType.GREATER:
        if (typeof left == "number" && typeof right == "number") return left > right;
        throw new CookeyError(self.lineData, "Only numbers are allowed for the '>' operator.");
      case TType.GREATER_EQ:
        if (typeof left == "number" && typeof right == "number") return left >= right;
        throw new CookeyError(self.lineData, "Only numbers are allowed for the '>=' operator.");
      case TType.LESS:
        if (typeof left == "number" && typeof right == "number") return left < right;
        throw new CookeyError(self.lineData, "Only numbers are allowed for the '<' operator.");
      case TType.LESS_EQ:
        if (typeof left == "number" && typeof right == "number") return left <= right;
        throw new CookeyError(self.lineData, "Only numbers are allowed for the '<=' operator.");

      case TType.EQ_EQ: return this.isEqual(left, right);
      case TType.BANG_EQ: return !this.isEqual(left, right);
    }

    return 0;
  }

  Call(self: Expr.Call): literal {
    let callee = self.callee.visit(this);

    let args = [];
    for (const arg of self.args) {
      args.push(arg.visit(this));
    }

    let func: FuncCallable = callee;

    if (!(func instanceof FuncCallable)) throw new CookeyError(self.lineData, "Only functions and classes can be called.");
    
    return func.call(this, args, self.lineData);
  }

  Unary(self: Expr.Unary): literal {
    let right = self.right.visit(this);

    switch (self.op.type) {
      case TType.PLUS:
        if (typeof right == "number") return right;
        throw new CookeyError(self.lineData, "Unary '+' can only be applied to numbers.");

      case TType.MINUS:
        if (typeof right == "number") return -right;
        throw new CookeyError(self.lineData, "Only numbers can be negated.");

      case TType.BANG:
        return !this.isTrue(right);
      
    }

    return false;
  }

  Variable(self: Expr.Variable): literal {
    return this.findVar(self.name, self);
  }

  Grouping(self: Expr.Grouping): literal {
    return self.value.visit(this);
  }


  private findVar(name: Token, expr: Base) {
    let distance = this.locals.get(expr);
    if (distance != null) return this.environment.getAt(distance, name.value)!.val; // guaranteed to have
    else return this.globals.get(name)!.val; // maybe have
  }

  private isTrue(val: literal) {
    if (val == null) return false;
    if (typeof val == "boolean") return val;
    return true;
  }

  private isEqual(a: literal, b: literal) {
    if (a == null && b == null) return true;
    if (a == null) return false;

    return a == b;
  }

  private stringify(str: string) {
    if (str == null) return "NaV";
    return str.toString();
  }
}

export { Interpreter };