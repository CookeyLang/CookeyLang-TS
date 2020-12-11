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
  Literal(_: Expr.Literal): literal { return 1; }
  Binary(_: Expr.Binary): literal { return 1; }
  Unary(_: Expr.Unary): literal { return 1; }
  Grouping(_: Expr.Grouping): literal { return 1; }
}

export { Visitor };