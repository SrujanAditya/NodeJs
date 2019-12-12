const fs = require('fs');
const csv = require('csvtojson');
const csvFilePath = 'data.csv';

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

convertCsvToJson().then(data => {
    result = '';
    data.forEach(obj => {
       result += JSON.stringify(obj) + '\n';
    });
    fs.writeFile('data.txt', result, (err) => {
        if (err) {
            console.log(err);
        }
    })
}).catch(err => {
    console.log("FILE DOES NOT EXIST", err);
});
