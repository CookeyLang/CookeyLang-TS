import { Token } from "../token";
import { Visitor } from "./visitor";

class Base {
  lineData: Token;

  constructor(tok: Token) { this.lineData = tok!; }

  visit(_: Visitor): literal { return 1; }
}

export { Base };