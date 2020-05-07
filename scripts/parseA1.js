const  fs = require('fs')
const Patient = require('../src/Patient.js')
const xlsx = require('node-xlsx').default

const {
    convertAddress,
    convertDateOfBirth
} = require('../src/utils.js')


function parse(practiceId, inputFile, outputFile) {
    const workSheetsFromFile = xlsx.parse(inputFile);
    const dataFromFile = workSheetsFromFile[0].data
    const data = dataFromFile.slice(1)


    const fields = [
        // "__empty",
        "lastname", 
        "firstname", 
        "dateOfBirth", 
        "address1", 
        "address2", 
        "address3", 
        "gender",
        "cardType",
        "cardNumber"
    ]

    
    
    const patients = data.map(d => {
    
        const o = { practiceId }
        fields.forEach((f, index) => {
            let val = d[index]
            if(typeof(val) == 'string') 
                val = val.trim()
            o[f] = val
        })
        
        convertAddress(o)
        convertDateOfBirth(o)
        
        o.gender = o.gender.slice(0,1).toUpperCase()
        return new Patient(o)
    })
    
    const csv = Patient.createTable(patients)  
    
    console.log("created ", patients.length, " rows")
    
    fs.writeFileSync(outputFile, csv)
}

module.exports = parse