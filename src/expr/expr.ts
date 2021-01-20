import { Base } from "./base";
import { Token } from "../token";
import { Visitor } from "./visitor";

class Literal extends Base {
  value: literal;

  constructor(token: Token, value: literal) {
    super(token);
    this.value = value;
  }

  visit(visit: Visitor): literal { return visit.Literal(this); }
}

class Assign extends Base {
  name: Token;
  value: Base;

  constructor(name: Token, value: Base) {
    super(name);
    this.name = name;
    this.value = value;
  }

  visit(visit: Visitor): literal { return visit.Assign(this); }
}

class Logic extends Base {
  left: Base;
  op: Token;
  right: Base;

  constructor(left: Base, op: Token, right: Base) {
    super(op);
    this.left = left;
    this.op = op;
    this.right = right;
  }

  visit(visit: Visitor): literal { return visit.Logic(this); }
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

class Call extends Base {
  callee: Base;
  args: Base[];

  constructor(callee: Base, paren: Token, args: Base[]) {
    super(paren);
    this.callee = callee;
    this.args = args;
  }

  visit(visit: Visitor): literal { return visit.Call(this); }
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

class Variable extends Base {
  name: Token;

  constructor(name: Token) {
    super(name);
    this.name = name;
  }

  visit(visit: Visitor): literal { return visit.Variable(this); }
}

class Grouping extends Base {
  value: Base;

  constructor(value: Base) {
    super(value.lineData);
    this.value = value;
  }

  visit(visit: Visitor): literal { return visit.Grouping(this); }
}

export { Literal, Assign, Logic, Binary, Call, Unary, Variable, Grouping };