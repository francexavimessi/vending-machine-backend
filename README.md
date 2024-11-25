# NestJS REST API with Swagger Documentation

This is a simple **NestJS** project for a **REST API** that provides basic product and inventory management features, with a **Swagger** documentation interface for easy exploration of the available endpoints.

## Project Overview

This project is designed to provide the following functionalities:

- Create, read, update, and delete products (CRUD operations).
- Track inventory of items using denominations (coins and banknotes).
- Purchase products using virtual transactions, with change calculations based on available inventory.

## Features

- **REST API** for product and inventory management.
- **Swagger Documentation** for API exploration and testing.
- **In-memory MongoDB** using **MongoMemoryServer** for testing purposes.
- **File upload handling** with dynamic path generation.

## Tech Stack

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **MongoDB**: A NoSQL database for storing product and transaction data.
- **Swagger**: A framework for API documentation, integrated into NestJS for automatic generation of API docs.
- **Jest**: A testing framework for writing unit and integration tests.

## Installation

### Prerequisites

- **Node.js** (>= 14.0.0)
- **MongoDB** (local or in-memory, using `mongodb-memory-server` for tests)

### Step-by-Step Installation

## Project setup

```bash
$ npm install
```

## Compile and run the project

````bash
# watch mode
$ npm run start:dev

# !!!you can't connect data base url connect database null


## Run tests

```bash
# unit tests
$ npm run test

````

## Run Docker comand

```bash
$ docker-compose up --build
```

## URL for API Document

```bash
$ http://localhost:3080/api-docs#/
```
