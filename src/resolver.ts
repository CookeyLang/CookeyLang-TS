import { Token } from "./token";

import { Base } from "./expr/base";
import * as Stmt from "./expr/stmt";
import * as Expr from "./expr/expr";

import { Interpreter } from "./interpreter";
import { CookeyError } from "./errors";
import { Visitor } from "./expr/visitor";


class Resolver extends Visitor {
  private interpreter: Interpreter;
  // name: is it defined
  private scopes: Map<string, boolean>[] = [];
  hasError = false;

  constructor(interpreter: Interpreter) {
    super();

    this.interpreter = interpreter;
  }

  init(stmts: Base[]) {
    try {
      for (const stmt of stmts) {
        stmt.visit(this);
      }
    } catch (e) {
      if (e instanceof CookeyError) {
        console.log(`<${e.lineData.file}> [ ${e.lineData.line} : ${e.lineData.col} ] ${e.message}`);
        this.hasError = true;
      }
    }
  }

  
  Block(self: Stmt.Block) {
    this.beginScope(); // append new 'variables'
    this.resolve(self.stmts);
    this.endScope(); // remove the scope
  }

  VarDecl(self: Stmt.VarDecl) {
    this.declare(self.name); // first state it exists
    if (self.value) this.resolve([self.value]);
    this.define(self.name); // then give the value
    // so we can remove cases like var a = a;
  }

  Variable(self: Expr.Variable) {
    if (this.scopes.length != 0 && this.scopes[this.scopes.length - 1].get(self.name.value) == false) throw new CookeyError(self.lineData, "Cannot set variable with itself as the value.");
    
    this.resolveLocal(self, self.name);
  }

  Assign(self: Expr.Assign) {
    this.resolve([self.value]);
    this.resolveLocal(self, self.name);
  }


  FuncDecl(self: Stmt.FuncDecl) {
    this.declare(self.name);
    this.define(self.name);
    this.resolveFunc(self);
  }

  Lambda(self: Expr.Lambda) {
    this.resolveFunc(self);
  }


  ExprStmt(self: Stmt.ExprStmt) {
    this.resolve([self.expr]);
  }

  IfStmt(self: Stmt.IfStmt) {
    this.resolve([self.condition]);
    this.resolve([self.thenBr]);
    if (self.elseBr) this.resolve([self.elseBr]);
  }

  ExitStmt(self: Stmt.ExitStmt) {
    this.resolve([self.exit]);
  }

  RetStmt(self: Stmt.RetStmt) {
    if (self.value) this.resolve([self.value]);
  }

  WhileStmt(self: Stmt.WhileStmt) {
    this.resolve([self.condition]);
    this.resolve([self.body]);
  }


  Binary(self: Expr.Binary) {
    this.resolve([self.left]);
    this.resolve([self.right]);
  }

  Call(self: Expr.Call) {
    this.resolve([self.callee]);

    for (const arg of self.args) {
      this.resolve([arg]);
    }
  }

  Grouping(self: Expr.Grouping) {
    this.resolve([self.value]);
  }

  Literal(_: Expr.Literal) {}

  Logic(self: Expr.Logic) {
    this.resolve([self.left]);
    this.resolve([self.right]);
  }

  Unary(self: Expr.Unary) {
    this.resolve([self.right]);
  }


  private resolve(stmts: Base[]) {
    for (const stmt of stmts) {
      stmt.visit(this);
    }
  }

  private resolveLocal(expr: Base, name: Token) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name.value)) {
        this.interpreter.resolve(expr, this.scopes.length - 1 - i);
        return;
      }
    }
  }

  private resolveFunc(func: Base) {
    if (func instanceof Stmt.FuncDecl || func instanceof Expr.Lambda) {
      this.beginScope();
      for (const param of func.params) {
        this.declare(param);
        this.define(param);
      }
      this.resolve(func.body);
      this.endScope();
    }
  }

  private beginScope() {
    this.scopes.push(new Map());
  }

  private endScope() {
    this.scopes.pop();
  }

  private declare(name: Token) {
    if (this.scopes.length == 0) return;
    
    let scope = this.scopes[this.scopes.length - 1];
    scope.set(name.value, false);
  }

  private define(name: Token) {
    if (this.scopes.length == 0) return;
    this.scopes[this.scopes.length - 1].set(name.value, true);
  }
}

export { Resolver };