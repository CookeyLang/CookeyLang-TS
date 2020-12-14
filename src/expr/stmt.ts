import { Base } from "./base";
import { Visitor } from "./visitor";

class ExprStmt extends Base {
  expr: Base;

  constructor(expr: Base) {
    super(expr.lineData);
    this.expr = expr;
  }

  visit(visit: Visitor): literal { return visit.ExprStmt(this); }
}

class ExitStmt extends Base {
  exit: Base;

  constructor(exit: Base) {
    super(exit.lineData);
    this.exit = exit;
  }

  visit(visit: Visitor): literal { return visit.ExitStmt(this); }
}

export { ExprStmt, ExitStmt };