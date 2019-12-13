import * as fs from 'fs';
import { csv } from 'csvtojson';
import { promisify } from 'util';

const csvFilePath = 'data.csv';
const writeFile = promisify(fs.writeFile);
async function convertCsvToJson() {
    const jsonArray = await csv({
        colParser: {
            "column1": "string",
            "column2": "string",
            "column3": "number",
            "column4": "number"
        },
        checkType: true
    }).fromFile(csvFilePath);
    return jsonArray;
}

async function writeData() {
    try {
        let result = '';
        const data = await convertCsvToJson();
        data.forEach(obj => {
        result += JSON.stringify(obj) + '\n';
      });
      await writeFile('data1.txt', result);
    } catch(err) {
        console.log(err);
    }
}

writeData().catch(err => {
    console.log(err);
})