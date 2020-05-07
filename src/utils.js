const { getJsDateFromExcel } = require("excel-date-to-js");

function convertAddress(o) {
    // SORT ADDRESS
    const a = [o.address1, o.address2, o.address3, o.address4].filter(x => !!x).map(x => {
        return x.toString().trim()
    }).join(", ")
    
    o.address = a.trim().replace(/ ,/g,',').replace(/,,/g,',').replace(/,*$/g,'').replace(/ +/g, ' ')
    delete o.address1
    delete o.address2
    delete o.address3
    delete o.address4
}

function convertDateOfBirth(o) {
    if(typeof (o.dateOfBirth) == "number" ) {
        const d = getJsDateFromExcel(o.dateOfBirth) 
        o.dateOfBirth = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" + d.getFullYear()
    }
}

function convertCategory(o) {
    // SORT category
    const categoryLookUp = {
        "Not Categorised": "000",
        "Discretionary Medical Card": "908",
        "Asylum Seeker": "902",
        "Unknown - 901": "901",
    }

    if(o.category && isNaN(parseInt(o.category))) {
        o.category = categoryLookUp[o.category]
    }
    
}

function convertFullName(o) {

    if(o.fullName.match(",")) {
        const bits = o.fullName.split(",").map(t=>t.trim())
        o.firstname = bits[1]
        o.lastname = bits[0]        
    }
    else {
        const [firstname, ...rest] = o.fullName.split(" ").map(t=>t.trim())
        o.firstname = firstname
        o.lastname = rest.join(" ")
    }

    delete o.fullName
}

function convertGMSNumberAndReview(o) {
    // SORT gmsNumberAndReview
    if(o.gmsNumberAndReview) {
        const bits = o.gmsNumberAndReview.replace(/\s+/g,' ').split(" ")
        o.cardNumber = bits[0]
    }
    delete o.gmsNumberAndReview
}

module.exports = {
    convertAddress,
    convertDateOfBirth,
    convertCategory,
    convertFullName,
    convertGMSNumberAndReview
}