import { pipeline } from "stream";
import * as fs from "fs";
import { csv } from "csvtojson";
const csvFilePath = "./data.csv";

pipeline(
    fs.createReadStream(csvFilePath, err => {
        if (err) {
            console.log("Read Error:", err);
        }
    }),
    csv({
        colParser: {
            column1: "string",
            column2: "string",
            column3: "number",
            column4: "number"
        },
        checkType: true
    }),
    fs.createWriteStream("data1.txt", err => {
        if (err) {
            console.log("Write Error:", err);
        }
    }),
    err => {
        if (err) {
            console.log(err);
        }
    }
);

