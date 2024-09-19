let csvToJson = require('convert-csv-to-json');

let fileInputName = 'beckham.csv'; 
let fileOutputName = 'beckham.json';

csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);