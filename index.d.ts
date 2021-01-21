declare module "cookeylang-ts" {
  /**
   * You are more likely to use `interpretFile`, which uses this to evaluate the file.
   * @param code The code to be executed
   * @param file The file name this code belongs to
   * @param debug Should debug symbols be printed? Defaults to `false`.
   */
  function interpretText(code: string, file: string, debug?: boolean): Promise<void>;

  /**
   * Execute the code inside a file. Make sure to add the extension as well!
   * @param file The file to be executed
   * @param debug Should debug symbols be printed? Defaults to `false`.
   */
  function interpretFile(file: string, debug?: boolean): Promise<void>;

  /**
   * Creates a **R**ead **E**val **P**rint **L**oop environment.
   */
  function repl(): void;
}