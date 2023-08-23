const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require('https'); // HTTPS-Modul hinzufügen
const path = require('path');

const app = express();
const PORT = 3000;
const HTTPS_PORT = 3443; // Port für den HTTPS-Server
const NOTES_FILE = "notes.json";

app.use(bodyParser.json());
app.use(cors());

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

// HTTPS-Server erstellen
const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
  },
  app
)

sslServer.listen(HTTPS_PORT, () => console.log(`Secure server 🚀🔑 on port ${HTTPS_PORT}`));

// Der HTTP-Server kann optional auch laufen gelassen werden
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
