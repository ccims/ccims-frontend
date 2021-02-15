# Webfrontend for Gropius

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.12.

## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Codegeneration from .graphql files
The app uses GraphQL instead of REST to communicate with the backend. The graphql files are in the
[data folder](src/app/data) and subdivided by entities they pertain to e.g. [label](src/app/data/label/label.graphql) <br />
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

## Mocked Members Page
Every project offers a mocked 'Members' page. It shows a list of users in the project and
offers a dialog to add users. However this area is purely a mock, changes are not persisted
and there are no other users who really have access to your project.

## Project structure
Have a look at the [routing module](src/app/app-routing.module.ts) to get a nice overview
of the primary components of the app.

| Aspect | Code |
| --- | --- |
| App Layout | [FrameComponent](src/app/frame/frame.component.ts) |
| Graph | [GraphsModule](src/app/graphs/graphs.module.ts) |
| Project context | [StateService](src/app/state.service.ts)
| Account management and auth with backend | [LoginComponent](src/app/login/login.component.ts), [RegisterComponent](src/app/login/register.component.ts), [AuthenticationService](src/app/auth/authentication.service.ts), [AuthGuard](src/app/auth/auth.guard.ts) |
| Apollo GraphQL Setup | [GraphQLModule](src/app/graphql.module.ts) |
| Type definitions for data from backend, helper objects for queries/muations, result of code generator | [generated](src/generated)

