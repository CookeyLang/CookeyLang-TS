import { Base } from "./base";
import { Token } from "../token";
import { Visitor } from "./visitor";

class Literal extends Base {
  value;

  constructor(token: Token, value: literal) {
    super(token);
    this.value = value;
  }

  visit(visit: Visitor): literal { return visit.Literal(this); }
}

class Binary extends Base {
  left: Base;
  op: Token;
  right: Base;

  constructor(left: Base, op: Token, right: Base) {
    super(op);
    this.left = left;
    this.op = op;
    this.right = right;
  }

  visit(visit: Visitor): literal { return visit.Binary(this); }
}

class Unary extends Base {
  op: Token;
  right: Base;

  constructor(op: Token, right: Base) {
    super(op);
    this.op = op;
    this.right = right;
  }

  visit(visit: Visitor): literal { return visit.Unary(this); }
}

class Grouping extends Base {
  value: Base;

  constructor(value: Base) {
    super(value.lineData);
    this.value = value;
  }

  visit(visit: Visitor): literal { return visit.Grouping(this); }
}

export { Literal, Binary, Unary, Grouping };