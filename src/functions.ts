import { Interpreter } from "./interpreter";
import { Environment } from "./environment";
import { defualtToken, Token } from "./token";
import { CookeyError, CookeyRet } from "./errors";

import * as Stmt from "./expr/stmt";


class FuncCallable {
  arity: number;
  call(_: Interpreter, _1: literal[], _2?: Token): literal {};
  toString(): string { return "" };

  constructor(arity: number = 0, call: (interpreter: Interpreter, args: literal[]) => literal = () => {}, toString: () => string = () => "") {
    this.arity = arity;
    this.call = call;
    this.toString = toString;
  }
}

class UserCallable extends FuncCallable {
  private decl: Stmt.FuncDecl;
  private closure: Environment;

  constructor(decl: Stmt.FuncDecl, closure: Environment) {
    super(0, () => {}, () => `<function ${this.decl.name.value}>`);
    
    this.decl = decl;
    this.arity = this.decl.params.length;

    this.closure = closure;
    
    this.call = (interpreter: Interpreter, args: literal[], callFrom: Token) => {
      let env = new Environment(this.closure);
      // define arguments/parameters
      for (let i = 0; i < this.decl.params.length; i++) {
        env.define(defualtToken, this.decl.params[i], args[i]);
      }
      
      try {
        interpreter.initBlock(this.decl.body, env);
      } catch (ret) {
        if (ret instanceof CookeyRet) {
          return ret.value;
        } else {
          if (ret instanceof CookeyError) ret.pushStack(callFrom || this.decl.lineData);
          throw ret; // prevent it from silently being ignored}
        }
      }

      return null;
    }
  }
}

export { FuncCallable, UserCallable };