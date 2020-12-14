import { Base } from "./base";
import { Token } from "../token";
import { Visitor } from "./visitor";

class VarDecl extends Base {
  mut: Token;
  name: Token;
  value: Base;

  constructor(mut: Token, name: Token, value: Base) {
    super(name);
    this.mut = mut;
    this.name = name;
    this.value = value;
  }

  visit(visit: Visitor): literal { return visit.VarDecl(this); }
}

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

export { VarDecl, ExprStmt, ExitStmt };