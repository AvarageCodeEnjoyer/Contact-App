const { format } = require('date-fns');
const express = require('express')
const bodyParser = require('body-parser')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs')
const app = express()

const port = 3000
const jsonPath = "./data/contacts.json"

/* ----------------- class for making JSON request from user ---------------- */

class JsonTools {
  constructor(req, res) {
    
  }

  static deleteUser(id) {
    try {
      let jsonData = JsonTools.readJson(userInfoPath)
      jsonData.users = jsonData.users.filter(user => user.id !== id)
      JsonTools.writeJson(userInfoPath, jsonData)
      console.log(`User '${id}' deleted successfully.`);

    } catch (error) {
      console.log(`Error in deleting user: ${id}`)
    }
  }

  static writeJson(filePath, parsedJsonData) {
    try {
      const updatedJson = JSON.stringify(parsedJsonData, null, 2);
      fs.writeFileSync(filePath, updatedJson, 'utf8', (err) => {
        if (err) throw err;
      })
    } catch (error) {
      console.log(`Error writing "${parsedJsonData}" to json file`)
    }
  }
    
  static readJson(filePath) {
    try {
      const jsonReturn = fs.readFileSync(filePath, 'utf8');
      if (!jsonReturn) {
        console.error('JSON file is empty.');
        return null; // Return an empty object or handle it as per your application logic.
      }
      return JSON.parse(jsonReturn);
    } catch (err) {
      console.error('Error reading or parsing JSON file:', err);
      return {}; // Return an empty object or handle the error as needed.
    }
  }
}

/* ------------------------------- User class ------------------------------- */

class Users {
  constructor(req, res) {
    this.formData = {
      fName: req.body.fName,
      lName: req.body.lName,
      Email: req.body.Email,
      Age: req.body.Age,
      Hobbies: req.body.Hobbies,
      Skills: req.body.Skills,
      creationDate: Date.now(),
      formattedDate: format(new Date(Date.now()), 'yyyy-MM-dd HH:mm:ss'),
      Photo: req.file
    }
  }

  saveUser() {
    try {
      let json = JsonTools.readJson(jsonPath)
      json.push(this.formData)
      JsonTools.writeJson(jsonPath, json)
    } catch (error) {
      console.log("ERROR", error)
    }
  }
}

/* -------------------------------------------------------------------------- */



// Set Views
app.set('./views', 'views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }));


/* ------------------------------ Get requests ------------------------------ */

let contacts = JsonTools.readJson(jsonPath)

app.get('/', (req, res) => {
  res.render('index', { contacts })
})

app.get('/edit/:id', (req, res) => {
  let id = req.params.id
  let contact = contacts[id]
  console.log(`Contact: ${contact}`)
  res.render('edit', { contact, id })
})

app.get('/delete/:id', (req, res) => {
  let id = req.params.id
  contacts.splice(id, 1);
  JsonTools.writeJson(jsonPath, contacts);
  res.render('confirm', { contacts, id })
})

app.get('/add', (req, res) => {
  res.render('add')
})

/* ------------------------------ Post requests ----------------------------- */

app.post('/formInput', upload.single('Photo'),(req, res, next) => {
  const newUserData = new Users(req, res)
  console.log(req.body)
  newUserData.saveUser()
  res.redirect('/')
  res.render('index', { contacts })
})

app.post('/edit/:id', (req, res) => {
    let changedUser = new Users(req, res)
    changedUser.saveUser()
    res.render('index', { contacts })
})

/* app.post('/confirm', (req, res) => {
  
}) */

/* ------------------------------ Start server ------------------------------ */

// Start Server
app.listen(port, () => {
console.log(`app running at http://localhost:${port}`)
})

