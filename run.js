const { parseA1, parseA2, parseC1, parseGenericPlr, parseGenericPdf }  = require("./scripts/index.js")

// parseA1("A","./data/practice_A_health_1/Patient Listing 01052020 Analysis.xls", "./out/a1.csv")

// parseA2("A", "./data/practice_A_health_1/77929_202004_PL.pdf", "./out/a2.csv")

// parseC1("C", "./data/Practice_C_HPM/KE Panel listing Apr20.csv", "./out/c1.csv")
// parseC1("C", "./data/Practice_C_HPM/KK Panel listing Apr20.csv", "./out/c2.csv")

// parseGenericPlr("D", "./data/Practice_D_Socrates/Patient Listing.xls", [
//     "fullName",
//     "__skip",
//     "dateOfBirth",
//     "gender",
//     "__skip",
//     "address",
//     "gmsNumberAndReview", //S876816A 31/08/2019
//     "__skip",
//     "registrationDate",
//     "cardType",
//     "__defaultHCP"
// ], "./out/d1.csv")


// parseGenericPlr("D", "./data/Practice_D_Socrates/GMS Listing.xls", [
//     "fullName",
//     "dateOfBirth",
//     "gender",
//     "address",
//     "cardNumber",
//     "__distance",
//     "__review",
//     "uniqueId",
//     "__status"
// ], "./out/d2.csv")

// parseGenericPlr("E", "./data/Practice_E_Socrates/Patient Listing.xls", [
//     "fullName",
//     "dateOfBirth",
//     "gender",
//     "address",
//     "phone",
//     "phone2",
//     "email",
//     "gmsNumberAndReview",
//     "registrationDate",
//     "cardType",
//     "__defaultHCP"
// ], "./out/e1.csv")

parseGenericPdf("E", "./data/Practice_E_Socrates/77627_202004_PL (1).pdf", "./out/e2.csv")
parseGenericPdf("E", "./data/Practice_E_Socrates/83108_202004_PL.pdf", "./out/e3.csv")

