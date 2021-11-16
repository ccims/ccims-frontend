(new README)

# Frontend for the Gropius system

## Introduction to Gropius

Software systems are usually built as component-based architectures. The whole idea behind this type of architecture is to decompose functionality into autonomous services. This results into components that are (almost) entirely self-contained and reusable, thus making the whole software developing process much easier.

Even though component-based architectures have many benefits like ease of deployment, reusability and independence, there are also challenges that need to be resolved. One of the most critical occurs when different components are managed in different issue management systems (IMS). This can lead to issues (in one group of components) not having a direct link to the root issues (in another group of components) that caused them in the first place. Dependencies between components can thus cause bugs to propagate through the components along the call chain.

Gropius is a cross component issue management system (CCIMS) that solves the described problem by enabling direct dependency links over issues which are managed in different issue management systems.

## The frontend of Gropius

As already mentioned, the idea behind Gropius is to manage cross-component issues for component-based architectures. The system graphically models cross-component problems along with the system architecture. The graphical representation is similar to that of an UML component diagram.

The system consists of three different parts: 
a) the [frontend](https://github.com/ccims/ccims-frontend), 
b) the [backend](https://github.com/ccims/ccims-backend) and 
c) the [connection between both of them](https://github.com/ccims/ccims-backend-gql). 

The frontend is responsible for visualizing the part of the system the user can interact with aka. the graphical representation of components and issues and also different methods of managing them. 

## Further details about Gropius

Information about all the critical and additional features the frontend consists of can be found on this page: "Using the project".
TODO: add link
TODO: add additional info

Information about the used technologies, structure of the project, connection with the backend, etc. can be found on this page:  "Managing the project".
TODO: add link
TODO: add additional info

## Credits

Information about all the team members that have worked on the frontend can be found on this page: "Team members".

## License

TODO: add additional info

(old README)

# Webfrontend for Gropius

## Development server
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.12.
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Project structure
Have a look at the [routing module](src/app/app-routing.module.ts) to get a nice overview
of the primary components of the app.

| Aspect | Code |
| --- | --- |
| App Layout | [FrameComponent](src/app/frame/frame.component.ts) |
| Graph | [GraphsModule](src/app/graphs/graphs.module.ts), look at the *declarations* |
| Project Context | [StateService](src/app/state.service.ts)
| Account Management and Auth with Backend | [LoginComponent](src/app/login/login.component.ts), [RegisterComponent](src/app/login/register.component.ts), [AuthenticationService](src/app/auth/authentication.service.ts), [AuthGuard](src/app/auth/auth.guard.ts) |
| Apollo GraphQL Client Setup | [GraphQLModule](src/app/graphql.module.ts) |
| Type Definitions for Data from Backend <br /> Helper Objects for Queries & Mutations <br /> All of this is *output of code generator* | [generated](src/generated)

## Documentation generation
The documentation is generated with [Compodoc](https://github.com/compodoc/compodoc). Run `npm run compodoc`for a documentation server. Navigate to `http://localhost:6060/`. The documentation will automatically reload if you change any of the source files. The configuration for the documentation is managed in [tsconfig.doc.json](tsconfig.doc.json).

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



