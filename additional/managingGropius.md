# Managing the Project

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

## Bindings to the Backend API
The app uses GraphQL to communicate with the backend.
The following documentation will assume you are familiar with the CCIMS backend API.

There are currently two different APIs for communicating with the backend:

### `data` API
The data API provides simple wrappers around the inner GraphQL queries
(e.g. `ComponentStoreService`) that can be included into any Angular class using dependency
injection.
Graphql source files are located in the [data](src/app/data) directory, subdivided by the entities
they pertain to (components, issues, etc.)

Refer to the code documentation for the handler of each entity type for more information.

It is not recommended that you use the `data` API for new code, as it has several drawbacks:

- Queries do not have any granularity: a lot of list queries will fetch all items in that list at
  once, without any pagination. A lot of node queries will fetch the node and all of its child nodes
  used in the GUI, often every time the GUI control accessing the data is created.
- Updates to data in one area (e.g. changing the name of a component) are not propagated to other
  areas. This is, however, sort of canceled out by the fact that data is reloaded every time.

### `data-dgql` API
The declarative data API attempts to improve upon the data API by introducing following new
concepts:

- `DataNode`: a shared, cached view into a node, agnostic of where the data was loaded from.
  Data may be loaded by lists, parent nodes, or queries about the node itself.
  All subscribers to the node (such as GUI components) can see the data and any updates
  simultaneously.
  Viewers will cause data to be loaded by default, but can be configured to prefer cached data
  (with `subscribeLazy` - useful when data has already been loaded by a DataList).
- `DataList`: a view into a list that makes use of pagination and provides an interface for
  server-side filtering.
  Lists will automatically load data into the corresponding DataNode of each item.
- `DataQuery`: a superclass of both DataNode and DataList that contains common methods.
- `DataService`: a single injectable that provides access to all data.
  Data is accessed using NodeIds and ListIds.
- `NodeId`: DataNodes are identified by a Node ID, which is a backend ID with a type tag.
- `ListId`: The specific list a DataList will provide a view into is identified by a List ID.
  List IDs are a NodeId with a list type tag
  (e.g. "the list of issues (type) in component abcdef (node)").

Also see the code documentation for more information.

### Code generation from .graphql files
We use a code generator (<https://graphql-code-generator.com/>) to create typescript classes from
.graphql files containing queries and mutations. The code generator generates one Angular service
class per query/mutation. These can then be included using dependency injection. These objects make
it easy to parameterize the mutations and queries and invoke them in typescript code.
You should, however, never need to use the GraphQL queries directly, as abstractions are provided in
`data` and `data-dgql`.

When you change .graphql files you have to rerun the code generator.
It will update the files in src/generated to match the changes in the .graphql files.
:warning: The backend has to be running with debugNoLogin set to true to make the backend schema
definition accessible to the generator via the urls defined in the codegen [configuration file](codegen.yml).  
Run `npm run generate` to execute the code generator when this condition is met.

## Mocked Members Page
Every project offers a mocked 'Members' page. It shows a list of users in the project and
offers a dialog to add users. However this area is purely a mock, changes are not persisted
and there are no other users who really have access to your project.
