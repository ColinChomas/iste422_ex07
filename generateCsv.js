const fs = require('fs');
const path = "./pii-data.json"; // Adjusted to relative path


function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}

async function generateCsv() {
    const date = getFormattedDate();
    const ccFilePath = `${date}_CC.csv`;
    const ssnFilePath = `${date}_SSN.csv`;

    const ccStream = fs.createWriteStream(ccFilePath);
    const ssnStream = fs.createWriteStream(ssnFilePath);

    ccStream.write('Name, Credit Card\n');
    ssnStream.write('Name, SSN\n');

    // Read and parse the JSON file
    const rawData = fs.readFileSync(path, 'utf-8');
    const data = JSON.parse(rawData);

    data.forEach((item) => {
        if (item.creditcard) {
            ccStream.write(`${item.name}, ${item.creditcard}\n`);
        }
        ssnStream.write(`${item.name}, ${item.ssn}\n`);
    });

    ccStream.end();
    ssnStream.end();
}

generateCsv();