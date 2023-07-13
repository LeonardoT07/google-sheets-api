const express = require("express");
const getAuthSheets = require("./authentication/auth.js");
const bodyParser = require("body-parser");

const app = express();

// BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Indica para o Express usar o EJS como View Engine
app.set('view engine', 'ejs');

// Indica para o Express onde ficarão os arquivos Estáticos
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.render('index.ejs');
});

app.get("/metadata", async (req, res) => {

    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    res.send(metadata.data);  
});


app.get("/getRows", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Leads",
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING"
    });

    res.send(getRows.data);
});

app.post("/addRow", async (req, res) => {
    
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
    
    const { values } = req.body;
  
    const row = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Leads",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values,
      },
    });
  
    res.send(row.data);
  });

app.listen(3001, () => {
    console.log("App rodando: http://localhost:3001 (Ctrl+Click)");
});