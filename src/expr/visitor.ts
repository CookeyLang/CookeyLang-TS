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
  VarDecl(_: Stmt.VarDecl): literal { return 1; }
  ExprStmt(_: Stmt.ExprStmt): literal { return 1; }
  ExitStmt(_: Stmt.ExitStmt): literal { return 1; }

  Literal(_: Expr.Literal): literal { return 1; }
  Binary(_: Expr.Binary): literal { return 1; }
  Unary(_: Expr.Unary): literal { return 1; }
  Variable(_: Expr.Variable): literal { return 1; }
  Grouping(_: Expr.Grouping): literal { return 1; }
}

export { Visitor };