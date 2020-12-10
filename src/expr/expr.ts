import { Base } from "./base";
import { Token, TType } from "../token";

class Literal extends Base {
  value;

  constructor(token: Token, value: unknown) {
    super(token);
    this.value = value;
  }

  print() { return String(this.value); }
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

  print() { return `(${TType[this.op.type]} ${this.left.print()} ${this.right.print()})`; }
}

class Unary extends Base {
  op: Token;
  right: Base;

  constructor(op: Token, right: Base) {
    super(op);
    this.op = op;
    this.right = right;
  }

  print() { return `(${TType[this.op.type]} ${this.right.print()})`; }
}

class Grouping extends Base {
  value: Base;

  constructor(value: Base) {
    super(value.lineData);
    this.value = value;
  }

  print() { return `(${this.value.print()})`; }
}

export { Literal, Binary, Unary, Grouping };