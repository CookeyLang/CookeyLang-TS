import { Interpreter } from "./interpreter";

class FuncCallable {
  arity: number;
  call: (interpreter: Interpreter, args: literal[]) => literal;
  toString: () => string;

  constructor(arity: number, call: (interpreter: Interpreter, args: literal[]) => literal, toString: () => string) {
    this.arity = arity;
    this.call = call;
    this.toString = toString;
  }
}

export { FuncCallable };