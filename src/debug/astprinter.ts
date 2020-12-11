import { Base } from "../expr/base";
import { Visitor } from "../expr/visitor";
import * as Expr from "../expr/expr";

import { TType } from "../token";


class AstPrinter extends Visitor {
  tree: Base;

  constructor(tree: Base) {
    super();
    this.tree = tree;
  }

  init() {
    return this.tree.visit(this);
  }

  Literal(self: Expr.Literal) {
    return String(self.value);
  }

  Binary(self: Expr.Binary): string {
    return `(${TType[self.op.type]} ${self.left.visit(this)} ${self.right.visit(this)})`;
  }

  Unary(self: Expr.Unary): string {
    return `(${TType[self.op.type]} ${self.right.visit(this)})`
  }

  Grouping(self: Expr.Grouping): string {
    return `(${self.value.visit(this)})`;
  }
}

export { AstPrinter };