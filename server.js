const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;
const NOTES_FILE = "notes.json";

app.use(bodyParser.json());

// Endpunkt zum Abrufen von Notizen
app.get("/notes", (req, res) => {
  if (fs.existsSync(NOTES_FILE)) {
    const notes = fs.readFileSync(NOTES_FILE, "utf8");
    res.json(JSON.parse(notes));
  } else {
    res.json([]);
  }
});

// Endpunkt zum Hinzufügen von Notizen
app.post("/notes", (req, res) => {
  const newNote = req.body;
  let notes = [];

  if (fs.existsSync(NOTES_FILE)) {
    notes = JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
  }

  notes.push(newNote);
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes));

  res.json({ status: "success" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(cors());
