import { Base } from "./expr/base";
import * as Stmt from "./expr/stmt";
import * as Expr from "./expr/expr";

import { Visitor } from "./expr/visitor";

import { TType } from "./token";


class Interpreter extends Visitor {
  trees: Base[];
  hasError = false;

  constructor(trees: Base[]) {
    super();
    this.trees = trees;
  }

  init() {
    for (const tree of this.trees) {
      tree.visit(this);
    }
    // return this.trees.visit(this);
  }


  ExprStmt(self: Stmt.ExprStmt): literal {
    let expr = self.expr.visit(this);
    console.log(expr);
    return expr;
  }

  ExitStmt(self: Stmt.ExitStmt) {
    let exitCode = self.exit.visit(this);
    console.log(exitCode); // for now
    return exitCode;
  }


  Literal(self: Expr.Literal): literal {
    return self.value;
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

  Grouping(self: Expr.Grouping): literal {
    return self.value.visit(this);
  }
}

export { Interpreter };