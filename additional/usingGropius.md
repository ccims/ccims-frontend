# Using the Project

This page lists all the features of the Gropius system and provides a description of how they can be used. In addition, the use of the features is visualized with pictures.

## Creating, Filtering and Deleting Projects
The main page contains a list of projects. To create a new project, click the "Create Project" button and enter a name and description (optional) for the project. <br />
The search field above the project list allows to search for projects and filter the list. <br />
Once a project is selected, the project overview is opened. After clicking on "Delete project" a confirmation is expected. <br />
A direct link to the project's component diagram is provided on the right side of each project item in the project list.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/mainPage.png" width="700"  />
</p>

## Project Overview
The "Project Overview" view contains the name and ID of the current project, the description that can be edited as well as the "Delete Project" button.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/overviewPage.png" width="700"/>
</p>

## Graph and Components
The graph of the project represents all components, issues (bugs, feature requests and unclassified issues), interfaces and relations between entities. <br />
In the upper left corner there are filters that allow the user to hide different types of issues (bugs, feature requests and unclassified issues) or issue connections to get a better visualization of the components and interfaces. <br />
In the upper right corner there is a button to create new components. The user is required to provide a name, repository URL, provider type (IMS), IMS-URL, and description (optional) for the component to be created.  <br /> <br />

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/graph.png" width="700"/>
</p>

A new interface is created by connecting two components. The user is expected to provide a name, a type, and optionally a description of the interface.
 <br />
Clicking on a component displays a popup window with a list of issues and details associated with the current component. There, new issues can be created for this component ("Create issue" button), issues can be filtered, the details can be edited and the component can be deleted. <br />
Clicking on an interface displays a pop-up window with the interface details and the issues associated with that interface. The "Create Issue" button can be used to create new issues associated with this interface. <br /> <br />

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/componentIssuesAndDetails.png" width="1000"/>
</p>

## Issues (Component Issues and Inteface Issues)
An issue can be a bug, a feature request, and an unclassified issue. Issues can be created for interfaces and for components in the component / interface pop-up. The user is expected to specify the issue title, type (bug, feature request, or unclassified), associated components, issue location, labels, assignees (not yet functional), and linked issues. Each of these fields is optional, except for the issue title. New labels for the issues can also be created.

<br />
<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/createIssue.png" width="400"/>
</p>

The issues are also displayed as a list in a separate view. Each issue has a title, author, assignees, labels and a category. The list of issues can be filtered and searched for issues. After selecting an issue, its details are displayed and can be edited, the issue can be commented and closed.
TODO: describe timeline

 <br />
 <p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/issues.png" width="700"/>
</p>

## Authentication
To use the app, the user must register or log in.  <br /> <br />

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/logInOrRegister.png" width="700"/>
</p>

## Timeline
After an issue is selected on the Issues page, another view is displayed containing a timeline. The timeline visualizes all the changes that have been made to the issue over time.

<br />
<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/timeline.png" width="700"/>
</p>

## Mocked Members Page
Every project offers a mocked "Members" page. It shows a list of users in the project and
offers a dialog to add users. However, this area is purely a mock, changes are not persistent
and there are no other users who have access to the currently handled project.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/members.png" width="700"/>
</p>

## Mocked Settings Menu
The application contains a mocked settings menu. The menu includes profile settings to update the display name, username, email and password. What's more, there is an option to create an access token and a "Dark Mode" option. However, the menu is purely a mock and changes are not persistent, nor are the latter two features functioning.

 <br />
 <p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/documentation/Kliment/Kristina/src/frontend-preview/settings.png" width="700"/>
</p>
 <br />
