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

  
  FuncDecl(self: Stmt.FuncDecl): string {
    return `function ${self.name.value}(${self.params.map(p => p.value).join(", ")}) {
${self.body.map(stmt => stmt.visit(this)).join("\n---\n")}
}`;
  }

  VarDecl(self: Stmt.VarDecl): string {
    return `${TType[self.mut.type]} ${self.name.value} = ${self.value.visit(this)};`;
  }

  ExprStmt(self: Stmt.ExprStmt): string {
    return `${self.expr.visit(this)};`
  }

  IfStmt(self: Stmt.IfStmt): string {
    return `(if (${self.condition.visit(this)}) ${self.thenBr.visit(this)}${self.elseBr ? ` else ${self.elseBr.visit(this)}` : ""})`;
  }

  WhileStmt(self: Stmt.WhileStmt): string {
    return `(while (${self.condition.visit(this)}) ${self.body.visit(this)})`;
  }

  ExitStmt(self: Stmt.ExitStmt): string {
    return `(exit ${self.exit.visit(this)})`;
  }

  RetStmt(self: Stmt.RetStmt): string {
    return `ret ${self.value.visit(this)};`;
  }

  Block(self: Stmt.Block): string {
    return `{\n${self.stmts.map(stmt => stmt.visit(this)).join("\n---\n")}\n}`;
  }


  Literal(self: Expr.Literal) {
    return `${typeof self.value == "string" ? "'" : ""}${String(self.value)}${typeof self.value == "string" ? "'" : ""}`;
  }

  Assign(self: Expr.Assign): string {
    return `(${self.name.value} = ${self.value.visit(this)})`;
  }

  Logic(self: Expr.Logic): string {
    return `(${self.left.visit(this)} ${TType[self.op.type]} ${self.right.visit(this)})`;
  }

  Lambda(self: Expr.Lambda): string {
    return `lambda (${self.params.map(p => p.value).join(", ")}): ${`{
  ${self.body.map(stmt => stmt.visit(this)).join("\n---\n")}
  }`}`;
  }

  Binary(self: Expr.Binary): string {
    return `(${TType[self.op.type]} ${self.left.visit(this)} ${self.right.visit(this)})`;
  }

  Call(self: Expr.Call): string {
    return `${self.callee.visit(this)}(${self.args.map(a => a.visit(this)).join(", ")})`;
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