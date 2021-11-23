# Frontend for the Gropius system

### Important details about Gropius

1. Development server:  
run `npm start` and navigate to [http://localhost:4200/](http://localhost:4200/).
<br />

2. Code generation from .graphql files:  
run `npm run generate`.
<br />

3. Documentation:  
can be found on [http://ccims.github.io/ccims-frontend](http://ccims.github.io/ccims-frontend).
<br />

4. Documentation generation:  
run `npm run compodoc`.
p.s. If folder Additional documentation is not visible below Getting started, run `compodoc -p tsconfig.doc.json --includes additional` and then `npm run compodoc`.
<br />

5. Gropius features:  
can be found on [Using Gropius](https://ccims.github.io/ccims-frontend/additional-documentation/using-gropius.html).
<br />

6. Used technologies, structure of the system, connection with the backend, and more:  
can be found on [Managing Gropius](https://ccims.github.io/ccims-frontend/additional-documentation/managing-gropius.html). 

## Introduction to Gropius

Software systems are usually built as component-based architectures. The whole idea behind this type of architecture is to decompose functionality into autonomous services. This results into components that are (almost) entirely self-contained and reusable, thus making the whole software developing process much easier.

Even though component-based architectures have many benefits like ease of deployment, reusability and independence, there are also challenges that need to be resolved. One of the most critical occurs when different components are managed in different **issue management systems** (IMS). This can lead to issues (in one group of components) not having a direct link to the root issues (in another group of components) that caused them in the first place. Dependencies between components can thus cause bugs to propagate through the components along the call chain.

Gropius is a **cross component issue management system** (CCIMS) that solves the described problem by enabling direct dependency links over issues which are managed in different issue management systems.

## The frontend

![preview00](https://github.com/ccims/ccims-frontend/blob/documentation/Kliment/Kristina/src/frontend-preview/preview00.png?raw=true)

As already mentioned, the idea behind Gropius is to manage cross-component issues for component-based architectures. The system graphically models cross-component problems along with the system architecture. The graphical representation is similar to that of an UML component diagram.

The system consists of two different parts: 1. the [frontend](https://github.com/ccims/ccims-frontend) and 2. the [backend](https://github.com/ccims/ccims-backend-gql).

The frontend is responsible for visualizing the part of the system the user can interact with aka. the graphical representation of components and issues and also different methods of managing them. Said methods include 1. creating components, interfaces and issues, 2. editing them, 3. analysing the current status of given issues and their propagation, etc. More about this can be found in the next point of this file.

## Credits

Further information regarding the members who have worked on the frontend of the system can be found on page [Contributors](https://ccims.github.io/ccims-frontend/additional-documentation/contributors.html) located in the documentation.

## License

This part still needs to be specified.





