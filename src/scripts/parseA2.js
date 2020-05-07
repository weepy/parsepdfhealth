const fs = require('fs')
const parsePDF = require('../parsepdf.js')
const Patient = require('../Patient.js')

function parseA2(practiceId, inputFile, outputFile) {
    parsePDF(inputFile, (patientData) => {
        const patients = patientData.map(o => new Patient({practiceId, ...o}))
          
        const csv = Patient.createTable(patients)
        
        fs.writeFileSync(outputFile, csv)
    })
    
}

module.exports = parseA2