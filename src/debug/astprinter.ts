import { Base } from "../expr/base";
import { Visitor } from "../expr/visitor";

import * as Stmt from "../expr/stmt";
import * as Expr from "../expr/expr";

import { TType } from "../token";


class AstPrinter extends Visitor {
  trees: Base[];

  constructor(trees: Base[]) {
    super();
    this.trees = trees;
  }

  init() {
    return `== PARSER ==
${this.trees.map(tree => tree.visit(this)).join("\n---\n")}
== RESRAP ==`;
  }

  
  ExprStmt(self: Stmt.ExprStmt): string {
    return `${self.expr.visit(this)};`
  }

  ExitStmt(self: Stmt.ExitStmt): string {
    return `(exit ${self.exit.visit(this)})`;
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