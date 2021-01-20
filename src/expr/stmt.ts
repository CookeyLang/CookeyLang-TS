import { Base } from "./base";
import { Token } from "../token";
import { Visitor } from "./visitor";

class FuncDecl extends Base {
  name: Token;
  params: Token[];
  body: Base[];

  constructor(name: Token, params: Token[], body: Base[]) {
    super(name);
    this.name = name;
    this.params = params;
    this.body = body;
  }

  visit(visit: Visitor): literal { return visit.FuncDecl(this); }
}

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

class RetStmt extends Base {
  value: Base;

  constructor(ret: Token, value: Base) {
    super(ret);
    this.value = value;
  }

  visit(visit: Visitor): literal { return visit.RetStmt(this); }
}

class Block extends Base {
  stmts: Base[];

  constructor(stmts: Base[]) {
    super(stmts[0].lineData);
    this.stmts = stmts;
  }

  visit(visit: Visitor): literal { return visit.Block(this); }
}

export { FuncDecl, VarDecl, ExprStmt, IfStmt, WhileStmt, ExitStmt, RetStmt, Block };