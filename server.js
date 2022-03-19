const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const uuid = require('uuid');
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// can use public folder for front end
app.use(express.static('public'));

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) =>{
        if(err) throw err;
        // Reading of notes file
        var notes = JSON.parse(data);
        // Output is the note
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    // req.body to create anything new
    fs.readFile('db/db.json', 'utf8', (err, data) =>{
        if(err) throw err;
        // Reading of notes file
        var notes = JSON.parse(data);
       // console.log(notes)

        var newNote = req.body;
        newNote.id = uuid.v4();
        console.log(newNote)

        var allNotes = [...notes, newNote]
        fs.writeFile('db/db.json', JSON.stringify(allNotes), err =>{
            if(err) throw err;
            return true;
        })

        fs.readFile('db/db.json', 'utf8', (err, data) =>{
            if(err) throw err;
            // Reading of notes file
            var notes = JSON.parse(data);
            // Output is the note
            res.json(notes);
        });
    });
})

// Add a delete. Add using the ID 

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if(err) throw err;
        var notes = JSON.parse(data);
        var deleteNote = notes.filter((del) => del.id !== req.params.id);
        fs.writeFileSync('db/db.json', JSON.stringify(deleteNote));
            res.json(deleteNote);
    })
    // res.send("DELETE Request Called")
  })
  
// Use your port
app.listen(PORT,() => console.log(`Listening on port: ${PORT}`));

