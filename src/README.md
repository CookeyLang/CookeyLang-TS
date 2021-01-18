# About
The code is divided into many folders, and yet more are just files. Here is a description of what each folder and file does.

|Folder/File|Description|
|--|--|
|`debug/`|Debugging functions, like printing the AST.|
|`expr/`|Classes for the AST.|
|`expr/base.ts`|This is the base AST all trees inherit from.|
|`expr/visitor.ts`|This 'implements' the trees (like for the interpreter).|
|`run/`|These are 'public' functions that are exported to the user for running CookeyLang.|
|`environment.ts`|A class for storing variables.|
|`errors.ts`|Classes for errors that are thrown, like an undefined variable.|
|`index.ts`|Entry point.|