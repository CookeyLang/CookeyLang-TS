import { CookeyError } from "./errors";
import { Token, TType } from "./token";

class Environment {
  private values = new Map<string, { mut: TType.FINAL | TType.VAR, val: literal }>();

  // The parent is what it inherits from, for example:
  /*
  {
    var g = 5; <----- parent
    {
      var g2 = 10; <- new Environment
    }
  }
  */
  private parent: Environment | null;
  constructor(parent: Environment | null = null) {
    this.parent = parent;
  }


  define(mut: Token, key: Token, val: literal) {
    // disallow multiple assignments
    if (this.values.has(key.value as string)) throw new CookeyError(key, `${key.value} has already been defined.`);
    this.values.set(key.value as string, { mut: mut.type as TType.FINAL | TType.VAR, val });
  }

  get(name: Token): { mut: TType.FINAL | TType.VAR, val: literal } | undefined {
    if (this.values.has(name.value as string)) return this.values.get(name.value as string);
    if (this.parent) return this.parent.get(name);
    throw new CookeyError(name, `Undefined variable ${name.value}.`);
  }

  getAt(distance: number, name: string): { mut: TType.FINAL | TType.VAR, val: literal } | undefined {
    return this.baseEnv(distance).values.get(name);
  }

  getMut(name: Token): TType.VAR | TType.FINAL {
    if (this.values.has(name.value as string)) return this.values.get(name.value as string)!.mut;
    // We don't need to get the mutability in the parent
    // it will either be 'var' or nonexistant
    return TType.VAR;
  }

  assign(name: Token, val: literal) {
    let mut = this.getMut(name);

    if (mut == TType.FINAL) throw new CookeyError(name, `Assignment to constant variable ${name.value}.`);

    if (this.values.has(name.value as string)) {
      this.values.set(name.value as string, { mut, val });
      return;
    }

    if (this.parent) {
      this.parent.assign(name, val);
      return;
    }

    throw new CookeyError(name, `Undefined variable ${name.value}.`);
  }

  assignAt(distance: number, name: Token, val: literal) {
    let env = this.baseEnv(distance);
    let mut = env.values.get(name.value)!.mut;
    this.baseEnv(distance).values.set(name.value, { mut, val });
  }


  // gets the environment that far away
  private baseEnv(distance: number) {
    let env: Environment = this;
    for (let i = 0; i < distance; i++) {
      env = env.parent!;
    }

    return env;
  }
}

export { Environment };