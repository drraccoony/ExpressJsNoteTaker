const { fstat } = require("fs")
const fs = require("fs");

module.exports = function(app) {

    app.get("/api/notes", function(req, res) {
        fs.readFile(__dirname + "/../db/db.json", (err, data) => {
            if (err) throw err
            let jsonData = JSON.parse(data);
            return res.json(jsonData);

        })
    });

    app.post("/api/notes", function(req, res) {
        var newNote = req.body;
        let savedNotes = [];
        let id = 0;
        fs.readFile(__dirname + "/../db/db.json", (err, data) => {
            if (err) throw err
            savedNotes = JSON.parse(data);
            for (var i = 0; i < savedNotes.length; i++) {
                if (savedNotes[i].id > id) {
                    id = savedNotes[i].id
                }
            }
            newNote.id = parseInt(id) + 1;
            savedNotes.push(newNote);
            fs.writeFile(__dirname + "/../db/db.json", JSON.stringify(savedNotes), "utf8", err => {
                if (err) throw err
                res.end()
            })
        })
    });

    app.delete("/api/notes/:id", function(req, res) {
        var noteTitle = req.params.id;
        console.log(req.params);
        console.log("Note Title: " + noteTitle)
        fs.readFile(__dirname + "/../db/db.json", (err, data) => {
            if (err) throw err
            var remainNotes = JSON.parse(data).filter(entry => {
                return entry.id != noteTitle
            })
            console.log(remainNotes)
            fs.writeFile(__dirname + "/../db/db.json", JSON.stringify(remainNotes),
                "utf8", err => {
                    if (err) throw err
                    res.end()
                })
        })

    })

}