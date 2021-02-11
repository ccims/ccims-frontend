# Webfrontend for Gropius

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.12.

## Codegeneration from .graphql files
When you change .graphql files you have to rerun the code generator. It will update the files in
src/generated to match the changes in the .graphql files.  
:warning: The backend has to be running with debugNoLogin set to true to make the backend schema
definition accessible to the generator via the urls defined in the codegen [configuration file](codegen.yml).  
Run `npm run generate` to execute the codegenerator when this condition is met.

## Codegenerator explanation
We use a codegenerator (https://graphql-code-generator.com/) to create typescript classes from .graphql files
containing queries and mutations. One class per query/mutation. We then use dependency injection to inject objects of theses classes 
into e.g. services via dependency injection. These objects make it easy to parameterize the mutations and queries and
invoke them in typescript code.
## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
