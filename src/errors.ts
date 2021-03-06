import { Token } from "./token";

// These are all the 'errors' CookeyLang has.
// An example of an 'error' is the break error, which tells a loop to break.

// Generic error (like undef variable)
class CookeyError extends Error {
  lineData: Token;
  calls: Token[] = [];

  constructor(token: Token, message: string) {
    super(message);
    this.lineData = token;
  }

  pushStack(call: Token) {
    this.calls.push(call);
  }
}

class CookeyRet extends Error {
  value: literal;

  constructor(value: literal) {
    super();
    this.value = value;
  }
}


export { CookeyError, CookeyRet };