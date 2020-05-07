const DateRegex = /[0-3][0-9]\/[0-1][0-9]\/[12][90][0-9][0-9]/

// lastname
// address
// firstname
// cardNumber // medical card
// ppsNumber // ss card
// dateOfBirth
// gender
// phone
// phone2
// email
// registrationDate
// category


const fields = [
    {
        name: 'practiceId',
        required: true
    },
    {   
        name: "lastname" ,
        required: true
    }, 
    {   
        name: "address" ,
        required: true
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
        name: "dateOfBirth",
        regex: DateRegex,
        required: true
    },
    {   
        name: "gender",
        regex: /MF/
    },
    {   
        name: "cardType",
        regex: /GMS DVC|MC|DVC|PP|DEL/
    }, 
    {   
        name: "category",
        regex: /000|899|901|902|903|904|905|906|907|908|909|910|911|912|913|914|915|916/
    },
    {
        name:'phone'
    },
    {
        name:'phone2'
    },
    {
        name:'email'
    },
    {
        name:'registrationDate',
        regex: DateRegex
    },
    {
        name:'uniqueId'
    }
]

class Patient {

    constructor(o) {

        fields.forEach(({name}) => {
            if(name in o) {
                this[name] = o[name]
            }
        })

        for(var i in o) {
            if(!i.match(/^__/)) {
                if(fields.findIndex(x => x.name==i) < 0) {
                    console.log("WARN found unused key", i)
                }
            }
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

    toCSRow() {
        const row = []
        fields.forEach(f => {
            let val = (this[f.name]||"").toString()
            
            val = val.replace(/"/g,'""')
            if(val.match(/,|"/)) val = `"${val}"`
            row.push(val)
        })
        return row
    }

}



Patient.fields = fields

Patient.createTable = (patients) => {
    const lines = patients.map(p =>  p.toCSRow().join(","))    
    
    const header = Patient.fields.map(f => f.name).join(",")
    lines.unshift(header)


    // let unused = {}
    // patients.forEach(p => {
    //     unused = {...unused, ...p.unusedData}
    // })
    
    // const unusedkeys = Object.keys(unused).join(", ")
    // if(unusedkeys) console.log('found unused keys: ', unusedkeys)
    
    return lines.join("\n")
}


module.exports = Patient