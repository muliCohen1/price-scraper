const express = require('express')
const app = express()
const { exec } = require("child_process");
const cors = require('cors')
const fs = require('fs');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    fs.readFile('buyingData.json', 'utf8', function(err, contents) {
        let parsedResult = JSON.parse(contents);
        let itemsArr = []
        for (let i in parsedResult.inputFields) {
            itemsArr.push(parsedResult.inputFields[i].item);
        }
        res.send(itemsArr);
    });
     
})
app.post('/', function (req, res) {
    let data = JSON.stringify(req.body);
    let headersSent = false;
    fs.writeFileSync('buyingData.json', data);
    function startScrape() {
        exec(`py soup.py`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            if (!headersSent) {
                res.send(stdout);
                headersSent = true;
            }
        });  
    }
    startScrape();
    setInterval(() => startScrape, 1.2e+6)
})
 
app.listen(3001,'0.0.0.0') //not the default 127.0.0.0(localhost) in order to access from another computer
