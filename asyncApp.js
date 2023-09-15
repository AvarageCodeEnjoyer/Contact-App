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




async function readContactsFile() {
  const data = await fs.readFile(jsonPath, 'utf8')
  return JSON.parse(data)
}


async function writeContactsFile(contacts) {
  await fs.writeFile(jsonPath, JSON.stringify( contacts, null, 2 ))
}

app.get('/', async (req, res) => {
  try {
    const contacts = await readContactsFile()
    res.render('index', { contacts })
  }
  catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
})

app.get('/add', async (req, res) => {
  res.render('add')
})

app.post('/add', async (req, res) => {
  try{
    const newContact = req.body
    const contacts = await readContactsFile()
    contacts.push(newContact)
    await writeContactsFile(contacts)
    res.redirect('/')
  }
  catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
})

app.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id
    const contacts = await readContactsFile()
    const contact = contacts[id]
    res.render('edit', { contact, id })    
   }
   catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
})

app.post('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id
    const updatedContact = req.body
    const contacts = await readContactsFile()
    contacts[id] = updatedContact
    await writeContactsFile(contacts);
    res.render('index', { contacts })
    // res.redirect('/')
   }
   catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
})

app.get('/view/:id', async (req, res) => {
  try {
    const id = req.params.id
    console.log(id)
    const contacts = await readContactsFile()
    const contact = contacts[id]
    console.log(contact)
    res.render('view', { contact })
   }
   catch (error) {
    console.error("VIEW" + error)
    res.status(500).send('Internal server error')
  }
})

app.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id
    const contacts = await readContactsFile()
    contacts.splice(id)
    await writeContactsFile(contacts)
    res.render('index', { contacts })
   }
   catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
})