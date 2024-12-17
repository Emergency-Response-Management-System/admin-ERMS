## MongoDB Installation and Importing Data
This guide provides step-by-step instructions on how to download and install MongoDB, add the path to system environment variables, and import available dummy data into MongoDB.

#### Installation
1. Visit the MongoDB download page at https://www.mongodb.com/try/download/community and download the latest version of MongoDB.

2. Once the download is complete, extract the downloaded files and copy them to a suitable location on your computer, such as C:\Program Files\MongoDB\Server\6.0\bin.

3. Add the path ```C:\Program Files\MongoDB\Server\6.0\bin``` to the system environment variables.

#### Importing Data
1. Get the "tool_mongodb" folder in this project and extract it to your computer. Or you can get tool mongodb at "https://www.mongodb.com/try/download/database-tools"

2. Copy all the files in the bin folder and paste them into C:\Program Files\MongoDB\Server\6.0\bin.

3. Get the "pharma_dumb" folder in this project and extract it to the D: drive.

4. Open a CMD in this path "C:\Program Files\MongoDB\Server\6.0\bin" and execute the following command:
```
mongorestore --db pharma D:\pharma_dumb
```
#### Exporting Data
```
mongodump --db name_database
```
## Steps to run this project in your local machine
To run this project in your local machine:
(nodejs compatible with version 16.x)

- Clone the repo
- Run ```npm install``` to install the dependencies
- Run ```npm run start``` to serve the app on your local machine.

To run this project with webpack:

- Change script start: 
```  
"scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
```
- Run ```npm run start``` to serve the app on your local machine.

## Documents helps to dev

https://react.dev/

https://jbetancur.github.io/react-data-table-component/?path=/story/custom-styles-compact-grid--compact-grid

https://www.educative.io/answers/how-to-create-a-react-application-with-webpack


