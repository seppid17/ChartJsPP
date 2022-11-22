# Chart.js++

A user-friendly platform to draw hierarchical charts using an extension to Chart.js.

<br>

## Installation
### Create the .env file
* Make a copy of the ``.env_sample`` file and rename the copy as ``.env``.
* Open the ``.env`` file with a text editor and modify the environment variables appropriately.

### Install node modules
* Make sure that you have Node and npm installed.
* Open a terminal this directory.
* Run the following command,

      npm install

### Run the server
* Make sure that the Mongodb server is running and the connection string is set correctly in the ``.env`` file
* Run the following command to start the application server,

      npm start

<br>

## Testing
_Testing is optional_

### Create the .env file
* Make a copy of the ``.env_sample`` file in the ``test`` directory and rename the copy as ``.env`` in the ``test`` directory.
* Open the ``.env`` file in the ``test`` directory with a text editor and modify the environment variables appropriately.

### Install node modules
* Make sure that you have Node and npm installed.
* Open a terminal this directory.
* Run the following command,

      npm install --production=false

### Run tests
* Open a terminal this directory (if not already opened).
* Run the following command,

      npm test