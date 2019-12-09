const csvFilePath = './data.csv';
const csv = require('csvtojson');
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
.then((jsonObj)=>{
	console.log(jsonObj);
})

csv().fromFile(csvFilePath);