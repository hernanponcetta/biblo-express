# Biblo REST API

The motivation behind this project was to create a Web API to function as back end for Biblo online Bookstore.

It includes many features as:

- User authentication
- Schema validation
- Password hashing
- Unit and integration testing

Based on simple REST principles, the Biblo Web API endpoints can return, create, update and delete resources from Biblo data base.

The base address of Web API is https://biblo-express.herokuapp.com/api. The API provides a set of endpoints, each with its own unique path.

To perform certain tasks, such as acces users data, update or delete books, authors or geners, users must have administration rights. A Json Web Token is provided after user authentication including user rights.

## Technologies

Project is created with:

- Node.js
- Express
- MongoDB

## Setup

The entire documentation can be found at https://biblo-express.herokuapp.com/developer. There you can review endpoints documentation and download a Postman Collection of Biblo API.
