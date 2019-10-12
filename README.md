# GF_Exercise
## GF Coding Exercise Design
Layered desgin to abstract the client facing "Phoenix" API away from the list of actions the are taken from each endpoint.
[Diagram](#design-diagram)
## Layers
+ [Client API(s)](#client-apis)
+ [Domain Service(s)](#domain-services)
+ Data
+ [Events](#events)
  + Event emitters
  + Event Listeners
  + Event Store
+ [Integrations - 3rd Party](#integrations)
  + [Service(s)](#integration-services)
  + [API(s)] (#integration-apis)
### Client APIs
Restful or CQRS type interfaces provided for application or client use. These apis exchange messages (comamands/querries) directly with domain services.
### Domain Services
Define the business logic and workflow of the system. Could be split into commands and queries and eventually event use multiple data stores if necessary.
Commands would 
  + Apply business rules about complex validation.
  + Store data in the approprate Phoenix data store
  + Emit events to mark action compeletion (or failure)
  + Send response to the caller (most likely a Client API)
### Data
### Events
Empower asynchronous and emergent system behavior(s). 
Domain services could both publish and subscribe to these emissions, 
e.g., When a new employee is sucessfully added to the Phoenix data store a 'phoenix.employees.employeeadded' event could be published. 
This event could be subscribed to by a 3rd-party integration service (Leviathan) to then take action against an external API.
## Integrations
### Integration Services
Provides a abstraction to manage business rule related to 3rd-party integrations
### Integration APIs
Provide interation with 3rd-party API(s). These can be hosted similar to the Client API(s) and then protected as "internal-only" resouces. 
> With Hapijs
## Design Diagram
![Alt text](design.jpeg?raw=true "Title:Design Diagram")
