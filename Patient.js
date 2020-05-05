const DateRegex = /[0-3][0-9]\/[0-1][0-9]\/[12][90][0-9][0-9]/

const fields = [
    {   
        name: "lastname" ,
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
        name: "firstname" ,
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
        name: "gender",
        regex: /MF/
    },
    {   
        name: "cardType",
        regex: /MC|DVC/
    }, 
    {   
        name: "category",
        regex: /000|899|901|902|903|904|905|906|907|908|909|910|911|912|913|914|915|916/
    },
    {
        name:"categoryExpiryDate",
        regex: DateRegex
    },
    {
        name:'phone'
    },
    {
        name:'mobilephone'
    },
    {
        name:'email'
    },
]

class Patient {

    constructor(_o) {
        const o = {..._o}
        fields.forEach(({name}) => {
            if(name in o) {
                this[name] = o[name]
                delete o[name]
            }
        })

        this.unusedData = {...o}

        if(Object.keys(this.unusedData).length) {
            console.log("unused keys", Object.keys(this.unusedData))
        }
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

    toRow() {
        const row = []
        fields.forEach(f => {
            const val = (this[f.name]||"").toString()
            row.push(val)
        })
        return row
    }

}



Patient.fields = fields

Patient.createTable = (patients) => {
    const lines = patients.map(p =>  p.toRow().join("\t"))    
    
    const header = Patient.fields.map(f => f.name).join("\t")
    lines.unshift(header)
    
    return lines.join("\n")
}


module.exports = Patient