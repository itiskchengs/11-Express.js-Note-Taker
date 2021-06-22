//Add dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

//Set up express app
const app = express();
let PORT = process.env.PORT || 3001;

//Note empty array 

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/db')));

//Set up the get route
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, '/db/db.json')));

//Set post route to get the data from the notes in the json file
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        console.log(data);
        let noteContainer = JSON.parse(data);
        if (err) {
            throw err;
        } else {
            noteContainer.push(newNote);
        }
        fs.writeFile('db/db.json', JSON.stringify(noteContainer), err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
        res.send('saved');
    })
    
})

app.delete('/api/notes/:id', (req, res) => {
    let noteId = req.params.id;
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        } else {
            let currentList = JSON.parse(data);
            for (let i = 0; i < currentList.length; i++) {
                console.log(currentList[i].id);
                if (currentList[i].id == noteId) {
                    currentList.splice([i], 1);
                    fs.writeFile('db/db.json', JSON.stringify(currentList), err => {
                        if (err) {
                            console.log('Error writing file', err)
                        } else {
                            console.log('Successfully wrote file')
                        }
                    })
                    res.send('deleted');
                }
            }
        }
    })
})

app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));