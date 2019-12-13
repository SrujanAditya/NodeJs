const fs = require('fs');
const csv = require('csvtojson');
const { promisify } = require("util");

const csvFilePath = 'data.csv';
const writeFile = promisify(fs.writeFile);
async function convertCsvToJson() {
    return jsonArray = await csv({
        colParser: {
            "column1": "string",
            "column2": "string",
            "column3": "number",
            "column4": "number"
        },
        checkType: true
    }).fromFile(csvFilePath);
}

async function writeData() {
    try {
        result = '';
        const data = await convertCsvToJson();
        data.forEach(obj => {
         result += JSON.stringify(obj) + '\n';
      });
      await writeFile('data.txt', result);
    } catch(err) {
        console.log("FILE DOES NOT EXIST", err);
    }
}

writeData().catch(err => {
    console.log(err);
})