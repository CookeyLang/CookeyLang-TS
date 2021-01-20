import { Interpreter } from "./interpreter";
import { Environment } from "./environment";
import { defualtToken } from "./token";
import { CookeyRet } from "./errors";

import * as Stmt from "./expr/stmt";


class FuncCallable {
  arity: number;
  call(_: Interpreter, _1: literal[]): literal {};
  toString(): string { return "" };

  constructor(arity: number = 0, call: (interpreter: Interpreter, args: literal[]) => literal = () => {}, toString: () => string = () => "") {
    this.arity = arity;
    this.call = call;
    this.toString = toString;
  }
}

class UserCallable extends FuncCallable {
  private decl: Stmt.FuncDecl;

  constructor(decl: Stmt.FuncDecl) {
    super(0, () => {}, () => `<function ${this.decl.name.value}>`);
    
    this.decl = decl;
    this.arity = this.decl.params.length;
    
    this.call = (interpreter: Interpreter, args: literal[]) => {
      let env = new Environment(interpreter.globals);
      // define arguments/parameters
      for (let i = 0; i < this.decl.params.length; i++) {
        env.define(defualtToken, this.decl.params[i], args[i]);
      }
      
      try {
        interpreter.initBlock(this.decl.body, env);
      } catch (ret) {
        if (ret instanceof CookeyRet) {
          return ret.value;
        }
      }

      return null;
    }
  }
}

export { FuncCallable, UserCallable };