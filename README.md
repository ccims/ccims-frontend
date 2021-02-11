# Webfrontend for Gropius

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.12.

## Codegeneration from .graphql Files
Before the application can be served you have to execute the codegenerator.  
:warning: The backend has to be running with debugNoLogin set to true to make the backend schema
definition accessible to the generator via the urls defined in the codegen [configuration file](codegen.yml).
Run `npm run generate` 
We use a codegenerator (https://graphql-code-generator.com/) to create typescript classes from .graphql files
containing queries and mutations. One class per query/mutation. We then use dependency injection to inject objects of theses classes 
into e.g. services via dependency injection. These objects make it easy to parameterize the mutations and queries and
invoke them in typescript code.
## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
