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

class IfStmt extends Base {
  condition: Base;
  thenBr: Base; // THENBRanch
  elseBr: Base | null;

  constructor(condition: Base, thenBr: Base, elseBr: Base | null) {
    super(condition.lineData);

    this.condition = condition;
    this.thenBr = thenBr;
    this.elseBr = elseBr;
  }

  visit(visit: Visitor): literal { return visit.IfStmt(this); }
}

class WhileStmt extends Base {
  condition: Base;
  body: Base;

  constructor(condition: Base, body: Base) {
    super(condition.lineData);
    this.condition = condition;
    this.body = body;
  }

  visit(visit: Visitor): literal { return visit.WhileStmt(this); }
}

class ExitStmt extends Base {
  exit: Base;

  constructor(exit: Base) {
    super(exit.lineData);
    this.exit = exit;
  }

  visit(visit: Visitor): literal { return visit.ExitStmt(this); }
}

class Block extends Base {
  stmts: Base[];

  constructor(stmts: Base[]) {
    super(stmts[0].lineData);
    this.stmts = stmts;
  }

  visit(visit: Visitor): literal { return visit.Block(this); }
}

export { VarDecl, ExprStmt, IfStmt, WhileStmt, ExitStmt, Block };