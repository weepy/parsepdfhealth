const  fs = require('fs')

const xlsx = require('node-xlsx').default
const { getJsDateFromExcel } = require("excel-date-to-js");
const {
    convertFullName,
    convertDateOfBirth,
    convertGMSNumberAndReview
} = require('./utils.js')

function parsePLR(inputFile, fields) {
    const worksheet = xlsx.parse(inputFile)[0]

    const genderIndex = fields.indexOf('gender')
    let data = worksheet.data.filter(d => {

        
        if(d.length != fields.length) return false
        
        const g = d[genderIndex].toString().toUpperCase()[0]
        return g == "M" || g == "F"
    })
    
    
    const patientData = data.map(d => {
        
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
        convertFullName(o)
        convertDateOfBirth(o)
       
        
        // SORT cardType
        if(o.cardType == "Private") {
            o.cardType = "MC"
        }
        else if(o.cardType == "Doctor Visit Card") {
            o.cardType = "DVC"
        }
        

        convertGMSNumberAndReview(o) 

        
        // SORT gender
        o.gender = o.gender.slice(0,1).toUpperCase()
        
      
        return o
    })
    

    return patientData

 
}

module.exports = parsePLR