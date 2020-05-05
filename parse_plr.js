const  fs = require('fs')
const Patient = require('./Patient.js')
const xlsx = require('node-xlsx').default
const { getJsDateFromExcel } = require("excel-date-to-js");

// function parse2(inputFile, outputFile) {
//     const workSheetsFromFile = xlsx.parse(inputFile);
//     const data = (workSheetsFromFile[0].data)
//     data.filter(row => {
//         if(row.length == 1) {
//             console.log(row[0])
//         }
//     })

// }

function parse(inputFile, outputFile) {
    const workSheetsFromFile = xlsx.parse(inputFile);


    function getDataRows(data) {
        const index = 8
    
        return data.slice(index+1).filter(d => d[0] != "Name" && d[1] != "D.O.B." && d[2] != "Gender" )
    }
    
    
    const data = getDataRows(workSheetsFromFile[0].data)
    
//    Name	D.O.B.	Gender	Address	HomePhone	Mobile	Email	GMS No. + Review	Reg Date	Type	Default HCP
    const fields = [
        "fullName",
        "dateOfBirth",
        "gender",
        "address",
        "phone",
        "mobilephone",
        "email",
        "gmsNumberAndReview", //S876816A 31/08/2019
        "registrationDate",
        "cardType",
        "defaultHCP"
    ]
    
    //Distance Code,Age Group,Category,Medical Card,Kname,Firstname,Gender,Date of Birth,Address 1,Address 2,Address 3,Address 4,PPSN,Dispensing Code,Card Type,Expiry Date
    
    
    const patients = data.map(d => {
        
        // console.log(d, d.length)
        
        const o = {}
        fields.forEach( (f, index) => {
            o[f] = d[index] || ""
        })
    
    
    
        // SORT ADDRESS
        if(o.address) {
            o.address = o.address.split(",").map(t => t.trim()).filter(t => !!t).join(", ")
        }
        

        // SORT name
        const bits = o.fullName.split(",").map(t=>t.trim())
        o.firstname = bits[1]
        o.lastname = bits[0]
        delete o.fullName
        
        // SORT date
        if(typeof (o.dateOfBirth) == "number" ) {
            const d = getJsDateFromExcel(o.dateOfBirth) 
            o.dateOfBirth = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" + d.getFullYear()
        }
        
        // SORT cardType
        if(o.cardType == "Private") {
            o.cardType = "MC"
        }
        else if(o.cardType == "Doctor Visit Card") {
            o.cardType = "DVC"
        }
        
        // SORT gmsNumberAndReview
        if(o.gmsNumberAndReview) {
            const bits = o.gmsNumberAndReview.replace(/\s+/g,' ').split(" ")
            o.ppsNumber = bits[0]
        }
        delete o.gmsNumberAndReview
        
        // SORT gender
        o.gender = o.gender.slice(0,1)
        console.log(o)

        const p = new Patient(o)
        
        // console.log(p.toRow())
        return p
    })
    

    const tsv = Patient.createTable(patients)
    
    fs.writeFileSync(outputFile, tsv)
    
}





parse('./data/Practice_B_incomplete_Socrates/Patient listing Report.xlsx', './output/Patient listing Report.tsv')