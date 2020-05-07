const parsePLR = require('../src/parseplr.js')
const  fs = require('fs')
const Patient = require('../src/Patient.js')


function parseGenericPlr(practiceId, inputFile, fields, outputFile) {
    const patientsData = parsePLR(inputFile,fields)

    const patients = patientsData.map(p => new Patient({practiceId, ...p}))
    
    const csv = Patient.createTable(patients)  
    
    console.log("created ", patients.length, " rows")
    
    fs.writeFileSync(outputFile, csv)
}


module.exports = parseGenericPlr