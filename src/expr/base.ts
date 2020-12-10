import { Token } from "../token";

class Base {
  lineData: Token;

  constructor(tok?: Token) { this.lineData = tok!; }
  print(): string { return ""; }
  visit(): unknown { return; }
}

export { Base };