
const PDFParser = require("j-pdfjson")


function parsePDF(inputFile, callback) {
    const  pdfParser = new PDFParser(this,1);

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        // JSON.stringify()
        
        // fs.writeFileSync("./content.json", JSON.stringify(pdfData));
    
        const {Pages} = pdfData.formImage
    
        let lines = [];
        
        Pages.forEach((p, i) => {
            
            const rows = parsePage(p)
            const s = rows[0].texts[0].text
    
            if(!s.match(/GP Panel Listing As Of/)) {
                return
            }
    
            const newLines = parseRows(rows)
            lines = lines.concat(newLines)
        })
    
        
    
        const str = lines.map(line => {
            return line.texts.map(t => t.text).join("\t")
        }).join("\n")
    
        
    
        let lastPatient = {}
    
        const patientData = lines.map(line => {
    
            const o = parseVals(line)
            // console.log(o)
    
            if(lastPatient && o.firstname && !o.lastname && !o.address) {
                
                o.lastname = lastPatient.lastname
                o.address = lastPatient.address
                // o.localHealthOffice = lastPatient.localHealthOffice
            }
    
            lastPatient = o
            return o
        })
    
        callback(patientData)
        
    
        
    });
    
    pdfParser.loadPDF(inputFile);
}





function parseRows(rows) {

    // if( rows.findIndex( r => r[0] == "GP Panel Listing")
    // console.log(rows)
    const index = rows.findIndex( r => r.texts[0].text == "Surname and Address")
    // console.log(index)
    // debugger
    if(index == -1) {
        return []
    }

    const r = rows.slice(index+1)
    r.pop()
    return r
}

function parsePage(p,i ) {


    p.Texts.forEach( t=> {
        t.R[0].T = unescape(t.R[0].T)
    })

    // fs.writeFileSync(`./page${i}.json`, JSON.stringify(p.Texts));
    


    let rows = []
    
    p.Texts.forEach( t=> {
        
        const y = t.y//Math.round(parseFloat(t.y*100))
        const x = t.x//Math.round(parseFloat(t.x*100))

        let row = rows.find( r => Math.abs(r.y - y) < 0.2 )

        
        if(row == null) {
            row = { y, texts: []}
            rows.push(row)
        }
        
        const text= { text: t.R[0].T, x }
        row.texts.push(text)  
    })

    rows.sort((a,b) => a.y-b.y)

    

    rows.forEach(line => {
        line.texts.sort((a,b) => a.x-b.x)
    })

    return rows

    

}



 function parseVals(line) {
    
    const dataPositions = {
        addressAndName: 1.175,
        __localHealthOffice: 16.295,
        __dispensingPatient: 17.642,
        __maritalStatus: 18.807,
        __asthmaReg: 20.477,
        firstname: 21.775,
        cardNumber: 26.63 ,
        ppsNumber:  30.008 ,
        __is70: 33.7,
        dateOfBirth: 34.035,
        __expiryDate: 36.9 ,
        gender: 40.413,
        cardType: 41.82,
        category: 43.275,
        __categoryExpiryDate: 44.605
    }

    
    const o = {}
    line.texts.forEach(word => {
        const {text, x} = word

        for(let name in dataPositions) {
            const xx = dataPositions[name]
            if(Math.abs(x - xx) < 0.1 ) {
                o[name] = text.trim()
                return
            }
        }

        console.log(`WARN couldn't find position for ${text} ${x}`)
    })

    
    if(o.addressAndName) {
        const [lastname, ...addressBits] = (o.addressAndName).split(",").map(t => t.trim())
        o.lastname = lastname
        o.address = addressBits.map(t => t.trim()).join(", ").replace(/, \$/,'')
        delete o.addressAndName
    }

    return o
}

module.exports = parsePDF