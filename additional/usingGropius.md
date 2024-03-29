# Using Gropius

This page lists all the features of the Gropius system and provides a description of how they can be used. In addition, the use of the features is visualized with pictures.

## Creating, Filtering and Deleting Projects

The main page contains a list of projects. To create a new project, click the "Create Project" button and enter a name and description (optional) for the project.
The search field above the project list allows to search for projects and filter the list.
Once a project is selected, the project overview is opened. After clicking on "Delete project" a confirmation is expected.
A direct link to the project's component diagram is provided on the right side of each project item in the project list.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/mainPage.png" width="700"  />
</p>

## Project Overview

The "Project Overview" view contains the name and ID of the current project, the description that can be edited as well as the "Delete Project" button.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/overviewPage.png" width="700"/>
</p>

## Graph and Components

The graph of the project represents all components, issues (bugs, feature requests and unclassified issues), interfaces and relations between entities.
In the upper left corner there are filters that allow the user to hide different types of issues (bugs, feature requests and unclassified issues) or issue connections to get a better visualization of the components and interfaces.
In the upper right corner there is a button to create new components. The user is required to provide a name, repository URL, provider type (IMS), IMS-URL, and description (optional) for the component to be created.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/graph.png" width="700"/>
</p>

A new interface is created by connecting two components. The user is expected to drag a node from the component to any position between the two components and specify a name, a type and optionally a description of the interface. Then the user can connect the other component to this node (interface).

Clicking on a component displays a popup window with a list of issues and details associated with the current component. There, new issues can be created for this component ("Create issue" button), issues can be filtered, the details can be edited and the component can be deleted.
Clicking on an interface displays a pop-up window with the interface details and the issues associated with that interface. The "Create Issue" button can be used to create new issues associated with this interface.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/componentIssuesAndDetails.png" width="1000"/>
</p>

## Issues (Component Issues and Inteface Issues)

An issue can be a bug, a feature request, and an unclassified issue. Issues can be created for interfaces and for components in the component / interface pop-up. The user is expected to specify the issue title, type (bug, feature request, or unclassified), associated components, issue location, labels, assignees (not yet functional), and linked issues. Each of these fields is optional, except for the issue title. New labels for the issues can also be created.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/createIssue.png" width="700"/>
</p>

The issues are also displayed as a list in a separate view. The aforementioned view is either displayed as a component / interface pop-up, or it is shown in page "Issues". Each issue has a title, author, assignees, labels and a category. The list of issues can be filtered so that specific ones will be targeted. After selecting an issue, its details are displayed on its own issue details page. There the issue can be edited, commented and closed. What's more, the details page for each issue includes a timeline, more about which can be found in section Timeline.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/issues.png" width="700"/>
</p>

## Timeline

After an issue is selected in page "Issues", the issue details page for the corresponding issue opens. There the issue can be managed. All changes made to the issue are reflected on its own timeline. In a way, the timeline visualizes the whole lifecycle of an issue, including: a) when it has been created, b) who and how has edited it, c) who has commented it, d) what labels have been assigned to it, e) which user has been assigned to it, f) to which other issue / component / interface it has been linked and finally g) who has closed it.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/timeline.png" width="700"/>
</p>

## Authentication

To use the app, the user must first sign up (if no account has been created yet) and then log in to the corresponding account. The sign up form requires a username, email and password. More details about the user's account can be managed in the settings menu once the user has logged in.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/logInOrRegister.png" width="700"/>
</p>

## Mocked Members Page

Every project offers a mocked "Members" page. It shows a list of users in the project and
offers dialogs to add and delete users. However, this area is purely a mock, changes are not persistent
and there are no other users who have access to the currently handled project.

<p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/members.png" width="700"/>
</p>

## Mocked Settings Menu

The application contains a mocked settings menu. The menu includes profile settings to update the display name, username, email and password. What's more, there is an option to create an access token and a "Dark Mode" option. However, the menu is purely a mock and changes are not persistent, nor are the latter two features functioning.

 <p align="center">
<img src="https://raw.githubusercontent.com/ccims/ccims-frontend/master/src/frontend-preview/settings.png" width="700"/>
</p>

