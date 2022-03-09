import { ClassInstance } from "./classinstance";
import { FuncCallable } from "./functions";
import { Interpreter } from "./interpreter";
import { Token } from "./token";

class CookeyClass extends FuncCallable {
  name: string;

  constructor(name: string) {
    super();
    this.arity = 0;
    this.name = name;


    this.toString = () => `<class ${this.name}>`;
    this.call = (interpreter: Interpreter, args: literal[], callFrom: Token) => {
      let instance: ClassInstance = new ClassInstance(this);
      return instance;
    };
  }
}

export { CookeyClass };