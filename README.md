# Feed Delivery Project

This project is divided into two parts:
- The backend is in the folder `api` and contains the communication layer with the database.
By default, the api will run on port **8082**.
- The frontend is in the folder `app` and contains the single-page application for the end user.
By default, the single-page application is available on port **8081**.
- Direct access to the database through the browser is available at port **7474**.


# How to start

To start the project, the easiest way is to use docker through the makefile commands:

## Start the project
```bash
make start
```
## Stop the project
```bash
make stop
```
## Print the status of the services
```bash
make status
```
## Print the logs of a specific service
```bash
make inspect SERVICE=api
```
## Initialize the database
```bash
make init
``` 
## Clean the database 
(for development and testing purposes)
```bash
make clean
```


# How to test

The folder `api` contains integrations test in the file `test.ts`. 
Those tests must run in a test environment as they are performing database operations.
They need a clean database to run successfully.

To run the test, you need to run jest inside the api folder:
```bash
cd api
npm test
```
Don't forget to start a clean project before running the tests.
