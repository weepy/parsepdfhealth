const { parseA1, parseA2, parseC1 }  = require('./src/scripts/index.js')

parseA1('A','./data/practice_A_health_1/Patient Listing 01052020 Analysis.xls', './out/a1.csv')

parseA2('A', "./data/practice_A_health_1/77929_202004_PL.pdf", `./out/a2.csv`)

parseC1('C', "./data/Practice_C_HPM/KE Panel listing Apr20.csv", `./out/c1.csv`)
parseC1('C', "./data/Practice_C_HPM/KK Panel listing Apr20.csv", `./out/c2.csv`)
