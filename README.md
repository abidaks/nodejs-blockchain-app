Create a new directory for your project:

mkdir my-blockchain-app
Navigate to the project directory:

bash

cd my-blockchain-app

Initialize a new Node.js project by running the following command and answering the prompts:

csharp

npm init


Install the necessary dependencies by running the following commands:

css

npm install --save crypto-js
npm install --save nodemon
npm install --save express


Create a package.json file to store information about the project and its dependencies:


java

touch package.json


Add the following code to package.json:
json

{
  "name": "my-blockchain-app",
  "version": "1.0.0",
  "description": "A simple blockchain app",
  "main": "app.js",
  "dependencies": {
    "crypto-js": "^4.1.1",
    "express": "^4.17.1",
    "nodemon": "^2.0.13"
  },
  "scripts": {
    "start": "nodemon app.js"
  },
  "author": "Kidus Berhanu",
  "license": "ISC"
}
Create an app.js file to store the code for your blockchain app:
bash

touch app.js
You can now start writing your blockchain app in app.js. Make sure to include the dependencies at the top of the file using require(), like in the previous code example.
