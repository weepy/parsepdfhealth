const fs = require('fs')
const parsePDF = require('../src/parsepdf.js')
const Patient = require('../src/Patient.js')

function parseGenericPdf(practiceId, inputFile, outputFile) {
  
    parsePDF(inputFile, (patientData) => {
        const patients = patientData.map(o => new Patient({practiceId, ...o}))
          
        const csv = Patient.createTable(patients)
        
        console.log("created ", patients.length, " rows")
        
        fs.writeFileSync(outputFile, csv)
    })
    
}

module.exports = parseGenericPdf