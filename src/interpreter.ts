import { Base } from "./expr/base";
import * as Stmt from "./expr/stmt";
import * as Expr from "./expr/expr";

import { Visitor } from "./expr/visitor";

import { TType } from "./token";
import { Environment } from "./environment";
import { CookeyError } from "./errors";


class Interpreter extends Visitor {
  trees: Base[];
  private environment = new Environment();

  constructor(trees: Base[]) {
    super();
    this.trees = trees;
  }

  init() {
    try {
      for (const tree of this.trees) {
        tree.visit(this);
      }
    } catch(e) {
      if (e instanceof CookeyError) {
        console.log(`<${e.lineData.file}> [ ${e.lineData.line} : ${e.lineData.col} ] ${e.message}`);
      }
    }
  }


  VarDecl(self: Stmt.VarDecl): literal {
    let value: literal = null;
    if (self.value) value = self.value.visit(this);

    this.environment.define(self.name, value);

    return null;
  }

  ExprStmt(self: Stmt.ExprStmt): literal {
    self.expr.visit(this);
    return null;
  }

  ExitStmt(self: Stmt.ExitStmt) {
    let exitCode = self.exit.visit(this);
    console.log(exitCode); // for now
    return null;
  }


  Literal(self: Expr.Literal): literal {
    return self.value;
  }

  Assign(self: Expr.Assign): literal {
    let value = self.value.visit(this);
    this.environment.assign(self.name, value);
    return value;
  }

  Binary(self: Expr.Binary): literal {
    let left: literal = self.left.visit(this);
    let right: literal = self.right.visit(this);

    switch (self.op.type) {
      case TType.PLUS:
        return Number(left) + Number(right);

      case TType.MINUS:
        return Number(left) - Number(right);

      case TType.TIMES:
        return Number(left) * Number(right);

      case TType.DIVIDE:
        return Number(left) / Number(right);
      
      case TType.MODULO:
        return Number(left) % Number(right);
      
      case TType.POWER:
        return Number(left) ** Number(right);
    }

    return 0;
  }

  Unary(self: Expr.Unary): literal {
    let right = self.right.visit(this);

    switch (self.op.type) {
      case TType.MINUS:
        return -right!;
    
      case TType.BANG:
        return !right!;
    }

    return false;
  }

  Variable(self: Expr.Variable): literal {
    return this.environment.get(self.name) as literal;
  }

  Grouping(self: Expr.Grouping): literal {
    return self.value.visit(this);
  }
}

export { Interpreter };