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

  
  VarDecl(self: Stmt.VarDecl): string {
    return `${TType[self.mut.type]} ${self.name.value} = ${self.value.visit(this)};`;
  }

  ExprStmt(self: Stmt.ExprStmt): string {
    return `${self.expr.visit(this)};`
  }

  ExitStmt(self: Stmt.ExitStmt): string {
    return `(exit ${self.exit.visit(this)})`;
  }


  Literal(self: Expr.Literal) {
    return `${typeof self.value == "string" ? "'" : ""}${String(self.value)}${typeof self.value == "string" ? "'" : ""}`;
  }

  Assign(self: Expr.Assign): string {
    return `(${self.name.value} = ${self.value.visit(this)})`;
  }

  Binary(self: Expr.Binary): string {
    return `(${TType[self.op.type]} ${self.left.visit(this)} ${self.right.visit(this)})`;
  }

  Unary(self: Expr.Unary): string {
    return `(${TType[self.op.type]} ${self.right.visit(this)})`
  }

  Variable(self: Expr.Variable): string {
    return `${self.name.value}`;
  }

  Grouping(self: Expr.Grouping): string {
    return `(${self.value.visit(this)})`;
  }
}

export { AstPrinter };