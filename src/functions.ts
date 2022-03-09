import { Interpreter } from "./interpreter";
import { Environment } from "./environment";
import { finalToken, Token } from "./token";
import { CookeyError, CookeyRet } from "./errors";

import { Base } from "./expr/base";
import * as Stmt from "./expr/stmt";
import * as Expr from "./expr/expr";


class FuncCallable {
  arity: number;
  call(_interpreter: Interpreter, _args: literal[], _callFrom?: Token): literal { };
  toString(): string { return "" };

  constructor(arity: number = 0, call: (interpreter: Interpreter, args: literal[]) => literal = () => {}, toString: () => string = () => "") {
    this.arity = arity;
    this.call = call;
    this.toString = toString;
  }
}

class UserCallable extends FuncCallable {
  private decl: Base;
  private closure: Environment;

  constructor(decl: Base, closure: Environment) {
    super(0, () => {}, () => {
      if (this.decl instanceof Stmt.FuncDecl) return `<function ${this.decl.name.value}>`;
      else if (this.decl instanceof Expr.Lambda) return `<anonymous function>`;
      return ""; // not reached
    });
    
    this.decl = decl;
    if (this.decl instanceof Stmt.FuncDecl || this.decl instanceof Expr.Lambda) this.arity = this.decl.params.length;

    this.closure = closure;
    
    this.call = (interpreter: Interpreter, args: literal[], callFrom: Token) => {
      let env = new Environment(this.closure);
      
      if (this.decl instanceof Stmt.FuncDecl || this.decl instanceof Expr.Lambda) {
        // define arguments/parameters
        for (let i = 0; i < this.decl.params.length; i++) {
          env.define(finalToken, this.decl.params[i], args[i]);
        }
        
        try {
          interpreter.initBlock(this.decl.body, env);
        } catch (ret) {
          if (ret instanceof CookeyRet) {
            return ret.value;
          } else {
            if (ret instanceof CookeyError) ret.pushStack(callFrom || this.decl.lineData);
            throw ret; // prevent it from silently being ignored
          }
        }
      }

      return null;
    }
  }
}

export { FuncCallable, UserCallable };