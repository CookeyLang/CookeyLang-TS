import { Base } from "./expr/base";
import * as Expr from "./expr/expr";

import { Visitor } from "./expr/visitor";

import { TType } from "./token";


class Interpreter extends Visitor {
  tree: Base;
  hasError = false;

  constructor(tree: Base) {
    super();
    this.tree = tree;
  }

  init() {
    return this.tree.visit(this);
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
    return self.visit(this);
  }
}

export { Interpreter };