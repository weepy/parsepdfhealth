const  fs = require('fs')
const Patient = require('./Patient.js')
const xlsx = require('node-xlsx').default
const { getJsDateFromExcel } = require("excel-date-to-js");

function parse(inputFile, outputFile) {
    const workSheetsFromFile = xlsx.parse(inputFile);

    // console.log(workSheetsFromFile)

    function getDataRows(data) {
        const index = data.findIndex(r => r[0] == 'Distance Code' && r[1] == 'Age Group')
    
        return data.slice(index+1)
    }
    
    
    const data = getDataRows(workSheetsFromFile[0].data)
    
    const fields = [
        "distanceCode", 
        "ageGroup", 
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
        "dispensingPatient",
        "cardType",
        "expiryDate"
    ]
    
    //Distance Code,Age Group,Category,Medical Card,Surname,Firstname,Sex,Date of Birth,Address 1,Address 2,Address 3,Address 4,PPSN,Dispensing Code,Card Type,Expiry Date
    
    const patients = data.map(d => {
    
        const o = {}
        fields.forEach( (f, index) => {
            o[f] = d[index]
        })
    
    
        // SORT ADDRESS
        o.address = [o.address1, o.address2, o.address3, o.address4].filter(x => !!x).join(", ")
        delete o.address1
        delete o.address2
        delete o.address3
        delete o.address4
    
        // SORT category
        const categoryLookUp = {
            "Not Categorised": "000",
            "Discretionary Medical Card": "908",
            "Asylum Seeker": "902",
            "Unknown - 901": "901"
        }
        o.category = categoryLookUp[o.category]
    
        // SORT date
        if(typeof (o.dateOfBirth) == "number" ) {
            const d = getJsDateFromExcel(o.dateOfBirth) 
            o.dateOfBirth = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" + d.getFullYear()
        }
    

        
    
        const p = new Patient(o)
        
        return p
    })
    
    
    
    const tsv = Patient.createTable(patients)

    
    fs.writeFileSync(outputFile, tsv)
        
    // const strings = patients.map(p =>  p.toRow().join("\t"))    
    
    // const header = Patient.fields.map(f => f.name).join("\t")
    // strings.unshift(header)

    
    // fs.writeFileSync(outputFile, strings.join('\n'))
    
}



parse('./data/PCRS patient list.xlsx', './output/PCRS patient list.tsv')