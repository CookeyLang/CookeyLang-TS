const { Token, TType } = require("../dist/token");
const { Lexer } = require("../dist/lexer");
const { Parser } = require("../dist/parser");
const { Interpreter } = require("../dist/interpreter");

const { Environment } = require("../dist/environment");
const { CookeyError } = require("../dist/errors");


describe("Interpreter", () => {
  test("expression", () => {
    expect(true).toBe(true); // todo
  });

  test("environment", () => {
    try {
      const env = new Environment();
      env.define(new Token(0, 0, "unknown", TType.FINAL, "final"), new Token(0, 0, "unknown", TType.IDENTIFIER, "a"), "b");
      expect(env.get(new Token(0, 0, "unknown", TType.IDENTIFIER, "a"))).toEqual({ mut: TType.FINAL, "val": "b" });

      env.get(new Token(0, 0, "unknown", TType.IDENTIFIER, "b")); // should error
      expect(0).toBe(1); // so we fail it
    } catch (e) {
      expect(e instanceof CookeyError).toBe(true);
    }
  });

  test("constant reassign", () => {
    try {
      const env = new Environment();
      env.define(new Token(0, 0, "unknown", TType.FINAL, "final"), new Token(0, 0, "unknown", TType.IDENTIFIER, "a"), "b");
      expect(env.get(new Token(0, 0, "unknown", TType.IDENTIFIER, "a"))).toEqual({ mut: TType.FINAL, "val": "b" });

      env.assign(new Token(0, 0, "unknown", TType.IDENTIFIER, "a"), "a"); // should error
      expect(0).toBe(1); // so we fail it
    } catch (e) {
      expect(e instanceof CookeyError).toBe(true);
    }
  });
});