 # Async App

This is a simple Express.js app that allows users to add, edit, view, and delete contacts.

## Prerequisites

- Node.js installed on your system.
- A package manager like npm (comes with Node.js) or yarn.

## Installation

Clone the repository:

```sh
git clone https://github.com/your-username/async-app.git
```

Install the dependencies:

```sh
npm install
```

## Usage

Start the app:

```sh
npm start
```

The app will be available at http://localhost:3000.

## Code Walkthrough

### app.js

The `app.js` file is the main entry point of the app. It sets up the Express app and defines the routes.

```javascript
const express = require('express')
const fs = require('fs').promises
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`asyncApp listening at http://localhost:${port}`)
})

const jsonPath = "./data/contacts.json"

// Set Views
app.set('./views', 'views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }));
```

### readContactsFile()

The `readContactsFile()` function reads the contacts from the JSON file.

```javascript
async function readContactsFile() {
  const data = await fs.readFile(jsonPath, 'utf8')
  return JSON.parse(data)
}
```

### writeContactsFile()

The `writeContactsFile()` function writes the contacts to the JSON file.

```javascript
async function writeContactsFile(contacts) {
  await fs.writeFile(jsonPath, JSON.stringify( contacts, null, 2 ))
}
```