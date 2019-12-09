import * as fs from 'fs';
import { csv } from 'csvtojson';
const csvFilePath = 'data.csv';
// const fs = require('fs');
// const csv = require('csvtojson');
csv({
	colParser:{
		"column1":"string",
        "column2":"string",
        "column3":"number",
        "column4":"number"
	},
	checkType:true
})
.fromFile(csvFilePath)
.then( (jsonObj)=>{
	 fs.writeFile('data.txt',JSON.stringify(jsonObj),(err,result) =>{
         if(err) {
             console.log(err);
         } else {
             console.log(result);
         }
     });
})

csv();