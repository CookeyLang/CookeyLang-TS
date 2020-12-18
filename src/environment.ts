import { CookeyError } from "./errors";
import { Token } from "./token";

class Environment {
  private values = new Map<string, literal>();

  define(key: Token, val: literal) {
    this.values.set(key.value as string, val);
  }

  get(name: Token) {
    if (this.values.has(name.value as string)) return this.values.get(name.value as string);
    throw new CookeyError(name, `Undefined variable ${name.value}.`);
  }

  assign(name: Token, val: literal) {
    if (this.values.has(name.value as string)) {
      this.values.set(name.value as string, val);
      return;
    }
    
    throw new CookeyError(name, `Undefined variable ${name.value}.`);
  }
}

export { Environment };