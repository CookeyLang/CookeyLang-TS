import { CookeyClass } from "./classes";

class ClassInstance {
  private cookeyClass: CookeyClass;

  constructor(cookeyClass: CookeyClass) {
    this.cookeyClass = cookeyClass;
  }

  toString() { return `<class instance of ${this.cookeyClass.name}>`; }
}

export { ClassInstance };