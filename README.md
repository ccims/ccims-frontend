# Frontend for the Gropius system

## Introduction to Gropius

Software systems are usually built as component-based architectures. The whole idea behind this type of architecture is to decompose functionality into autonomous services. This results into components that are (almost) entirely self-contained and reusable, thus making the whole software developing process much easier.

Even though component-based architectures have many benefits like ease of deployment, reusability and independence, there are also challenges that need to be resolved. One of the most critical occurs when different components are managed in different **issue management systems** (IMS). This can lead to issues (in one group of components) not having a direct link to the root issues (in another group of components) that caused them in the first place. Dependencies between components can thus cause bugs to propagate through the components along the call chain.

Gropius is a **cross component issue management system** (CCIMS) that solves the described problem by enabling direct dependency links over issues which are managed in different issue management systems.

## The frontend

![preview00](https://github.com/ccims/ccims-frontend/blob/documentation/Kliment/Kristina/src/frontend-preview/preview00.png?raw=true)

As already mentioned, the idea behind Gropius is to manage cross-component issues for component-based architectures. The system graphically models cross-component problems along with the system architecture. The graphical representation is similar to that of an UML component diagram.

The system consists of two different parts: 1. the [frontend](https://github.com/ccims/ccims-frontend) and 2. the [backend](https://github.com/ccims/ccims-backend-gql).

The frontend is responsible for visualizing the part of the system the user can interact with aka. the graphical representation of components and issues and also different methods of managing them. Said methods include 1. creating components, interfaces and issues, 2. editing them, 3. analysing the current status of given issues and their propagation, etc.
(TODO: specify this part)

## Further details: documentation, features, used technologies and structure

The github page of the whole project can be found here: [https://github.com/ccims](https://github.com/ccims).

The documentation of the frontend can be found here: [http://ccims.github.io/ccims-frontend](http://ccims.github.io/ccims-frontend).

Further information regarding how to use the project can be found on page [Using the Project](https://ccims.github.io/ccims-frontend/additional-documentation/using-the-project.html) located in the documentation. 
This includes 1. main features and 2. ditional features.

Further information regarding how to manage the project can be found on page [Managing the Project](https://ccims.github.io/ccims-frontend/additional-documentation/managing-the-project.html) located in the documentation. 
This includes 1. used technologies, 2. structure of the project, 3. connection with the backend, etc.
(TODO: specify this part)

## Credits

Further information regarding the members who have worked on the frontend of the system can be found on page [Contributors](https://ccims.github.io/ccims-frontend/additional-documentation/contributors.html) located in the documentation. 

## License

(TODO: specify this part)





