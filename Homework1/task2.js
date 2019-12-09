const csvFilePath = './data.csv';
const csv = require('csvtojson');
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
	console.log(jsonObj);
})

csv().fromFile(csvFilePath);