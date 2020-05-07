const  fs = require('fs')
const Patient = require('../src/Patient.js')
const xlsx = require('node-xlsx').default

const {
    convertAddress,
    convertDateOfBirth,
    convertCategory
} = require('../src/utils.js')


function parse(practiceId, inputFile, outputFile) {
    const workSheetsFromFile = xlsx.parse(inputFile);
    const dataFromFile = workSheetsFromFile[0].data
    const data = dataFromFile.slice(3)

    // console.log(dataFromFile[2])
    // return
    const fields = [
        "__distanceCode",
        "__ageGroup", 
        "category", 
        "cardNumber", 
        "lastname", 
        "firstname", 
        "gender", 
        "dateOfBirth",
        "address1",
        "address2",
        "address3",
        "address4",
        "ppsNumber",
        "__dispensingCode",
        "cardType",
        "__expiryDate"
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
        convertCategory(o)
        
        o.gender = o.gender.slice(0,1).toUpperCase()
        return new Patient(o)
    })
    
    const csv = Patient.createTable(patients)  
    
    console.log("created ", patients.length, " rows")
    
    fs.writeFileSync(outputFile, csv)
}

module.exports = parse