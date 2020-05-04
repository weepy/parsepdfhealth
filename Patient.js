const DateRegex = /[0-3][0-9]\/[0-1][0-9]\/[12][90][0-9][0-9]/

const fields = [
    {   
        name: "surname" ,
        required: true
    }, 
    {   
        name: "address" ,
        required: true
    },
    {
        name: "localHealthOffice",
        regex: /[0-3][0-9]/
    },
    {   
        name: "dispensingPatient",
        regex: /Y|N/
    },
    {
        name:"maritalStatus",
        regex: /S|M|W|P|D|C|R|I|U/
    },
    {
        name: "asthmaReg",
        regex: /Y|N/
    },
    {   
        name: "forename" ,
        required: true
    }, 
 
    {   
        name: "cardNumber",
        regex: /[A-Z0-9]+/
    }, 
    {   
        name: "ppsNumber",
        regex: /[A-Z0-9]+/
    }, 
    {
        name: "is70"
    },
    {
        name: "dateOfBirth",
        regex: DateRegex
    },
    {   
        name: "expiryDate",
        type:  DateRegex
    }, 
    {   
        name: "sex",
        regex: /MF/
    },
    {   
        name: "cardType",
        regex: /MC|DVC/
    }, 
    {   
        name: "patientCategory",
        regex: /000|899|901|902|903|904|905|906|907|908|909|910|911|912|913|914|915|916/
    },
    {
        name:"patientCategoryExpiryDate",
        regex: DateRegex
    }
]

class Patient {

    constructor(o) {
        fields.forEach(({name}) => {
            if(name in o) {
                this[name] = o[name]
            }
        })
    }

    validate() {

        const errs = []

        fields.forEach(f => {

            const val = this[f.name]

            if(f.required && val==null) {
                errs.push(`${f.name} is required`)
            }
            if(val!=null && f.regex && val.match(f.regex)) {
                errs.push(`${val} doesn't match ${f.regex}`)
            }

        })

        return errs
    }

}


// [ { text: 'Ã\'BRIAIN , 7 HIGFIELD , ENNIS ROAD ,  , CO LIMERICK',
//        x: 1.175 },
//      { text: '23', x: 16.295 },
//      { text: 'N', x: 17.642 },
//      { text: 'MÃIRÃN', x: 21.775 },
//      { text: 'A409492A', x: 26.63 },
//      { text: '9344761A', x: 30.008 },
//      { text: '*', x: 33.7 },
//      { text: '29/11/1940', x: 34.035 },
//      { text: '31/07/2021', x: 36.9 },
//      { text: 'M', x: 40.413 },
//      { text: 'MC', x: 41.82 },
//      { text: ' 000', x: 43.275 } ] }
Patient.fields = fields



module.exports = Patient