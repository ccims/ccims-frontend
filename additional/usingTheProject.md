# Using the Project

## Main features
### Creating, Filtering and Deleting Projects
The main page contains a list of projects. To create a new project, click the "Create Project" button and enter a name and description (optional) for the project. <br />
The search field above the project list allows to search for projects and filter the list. <br />
Once a project is selected, the project overview is opened. After clicking on "Delete project" a confirmation is expected. <br />
A direct link to the project's component diagram is provided on the right side of each project item in the project list.

<img src="mainPage.png" width="700"/>

### Project Overview
The Project Overview view contains the name and ID of the current project, the description, which can be edited, as well as the Delete Project button.

<img src="overviewPage.png" width="700"/>

### Graph and Components
The graph of the project represents all components, issues (bugs, feature requests and unclassified issues), interfaces and connections between entities. <br />
In the upper left corner there are filters that allow the user to hide different types of issues (bugs, feature requests and unclassified issues) or issue relations to get a better visualisation of the components and interfaces. <br />
In the upper right corner a button allows for new components to be created. The user is expected to provide a  name, a repository-URL, a provider type(IMS), an IMS-URL as well as a description (optional) for the component to create it. <br />

<img src="graph.png" width="700"/>
 <br />
By connecting two of the components, an interface is created. The user is expected to provide a name, a type and optionally a description of the interface.
 <br />
By clicking on a component, a pop up containing a list of issues and details of the current component shows up. There, new issues for this component can be created, issues can be filtered, the details can be edited and the component can be deleted. <br /> <br />
<img src="componentIssuesAndDetails.png" width="1100"/>
 <br />

### Issues (Component Issues and Inteface Issues)
... TODO
### Authentication


... TODO

## Additional features
### Mocked Members Page
... Every project offers a mocked 'Members' page. It shows a list of users in the project and
offers a dialog to add users. However this area is purely a mock, changes are not persisted
and there are no other users who really have access to your project.
### Mocked Settings Menu
... profile settings
... access token
... dark mode TODO
### Timeline
... TODO
### Labels
... TODO

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


## Codegenerator explanation
We use a codegenerator (https://graphql-code-generator.com/) to create typescript classes from .graphql files
containing queries and mutations. One class per query/mutation. We then use dependency injection to inject objects of theses classes 
into e.g. services via dependency injection. These objects make it easy to parameterize the mutations and queries and
invoke them in typescript code.

## Mocked Members Page
Every project offers a mocked 'Members' page. It shows a list of users in the project and
offers a dialog to add users. However this area is purely a mock, changes are not persisted
and there are no other users who really have access to your project.