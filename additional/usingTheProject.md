# Using the Project

#### Creating, Filtering and Deleting Projects
The main page contains a list of projects. To create a new project, click the "Create Project" button and enter a name and description (optional) for the project. <br />
The search field above the project list allows to search for projects and filter the list. <br />
Once a project is selected, the project overview is opened. After clicking on "Delete project" a confirmation is expected. <br />
A direct link to the project's component diagram is provided on the right side of each project item in the project list.

<img src="mainPage.png" width="700"/>
 <br />
 
#### Project Overview
The Project Overview view contains the name and ID of the current project, the description, which can be edited, as well as the Delete Project button.

<img src="overviewPage.png" width="700"/>
<br />

#### Graph and Components
The graph of the project represents all components, issues (bugs, feature requests and unclassified issues), interfaces and connections between entities. <br />
In the upper left corner there are filters that allow the user to hide different types of issues (bugs, feature requests and unclassified issues) or issue relations to get a better visualisation of the components and interfaces. <br />
In the upper right corner a button allows for new components to be created. The user is expected to provide a  name, a repository-URL, a provider type(IMS), an IMS-URL as well as a description (optional) for the component to create it. <br /> <br />

<img src="graph.png" width="700"/>
 <br />

By connecting two of the components, an interface is created. The user is expected to provide a name, a type and optionally a description of the interface.
 <br />
By clicking on a component, a pop up containing a list of issues and details of the current component shows up. There, new issues for this component can be created ("Create Issue" button), issues can be filtered, the details can be edited and the component can be deleted. <br />
Similarly, by clicking on an interface, a pop up containing the details and the issues assicuated with this issue shows up. A "Create Issue" button allows for new issues associated with this interface to be created.  <br /> <br />
<img src="componentIssuesAndDetails.png" width="1000"/>
 <br />

#### Issues (Component Issues and Inteface Issues)
An issue can be a bug, a feature request and an unclassified issue. Issues can be created for interfaces and for components in the component/interface pop-up. The user is expected to provide a title of the issue, a type (bug, feature request or unclassified), associated components, location of the issue, labels, assignees (not yet functional) and linked issues and linked issues. Each of these fields is optional, except for the name of the issue. New labels for the issues can also be created.

<br />
<img src="createIssue.png" width="500"/>
 <br />

Issues are also displayed as a list in a seperate view. Each of them has a title, an author, assignees, labels and a category. The issue list can be filtered and issues can be searched. After an issue is selected, it's details are displayed and can be edited, the issue can be commented and closed.
TODO: describe timeline

 <br />
<img src="issues.png" width="700"/>
 <br />

#### Authentication
For a user to use the app, signing up or logging in is required.  <br /> <br />

<img src="logInOrRegister.png" width="1000"/>
 <br />


#### Mocked Members Page
Every project offers a mocked 'Members' page. It shows a list of users in the project and
offers a dialog to add users. However, this area is purely a mock, changes are not persisted
and there are no other users who really have access to your project.

#### Mocked Settings Menu
The application contains a mocked settings menu. The menu includes profile settings (to update display name, username, email and password), creating an access token and a Dark Mode option. However, the menu is purely a mock and changes are not persisted.
#### Timeline
TODO

