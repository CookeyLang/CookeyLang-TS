import * as Stmt from "./stmt";
import * as Expr from "./expr";

/*
The visitor class allows us to implement our Expr classes.

  Visitor
    implementations
  Base
    data

This means every Base will call Visitor implementation with their data, namely `self`.
However, the entry point is actually the Visitor itself, which will call Base with `self`.
*/
class Visitor {
  ClassDecl(_: Stmt.ClassDecl): literal { return 1; }
  FuncDecl(_: Stmt.FuncDecl): literal { return 1; }
  VarDecl(_: Stmt.VarDecl): literal { return 1; }
  ExprStmt(_: Stmt.ExprStmt): literal { return 1; }
  IfStmt(_: Stmt.IfStmt): literal { return 1; }
  WhileStmt(_: Stmt.WhileStmt): literal { return 1; }
  ExitStmt(_: Stmt.ExitStmt): literal { return 1; }
  RetStmt(_: Stmt.RetStmt): literal { return 1; }
  Block(_: Stmt.Block): literal { return 1; }

  Literal(_: Expr.Literal): literal { return 1; }
  Assign(_: Expr.Assign): literal { return 1; }
  Logic(_: Expr.Logic): literal { return 1; }
  Lambda(_: Expr.Lambda): literal { return 1; }
  Binary(_: Expr.Binary): literal { return 1; }
  Call(_: Expr.Call): literal { return 1; }
  Unary(_: Expr.Unary): literal { return 1; }
  Variable(_: Expr.Variable): literal { return 1; }
  Grouping(_: Expr.Grouping): literal { return 1; }
}

export { Visitor };