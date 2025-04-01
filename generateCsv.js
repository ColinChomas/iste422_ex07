const fs = require('fs');

function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}

async function generateCsv(filePath) {
    const date = getFormattedDate();
    const ccFilePath = `${date}_CC.csv`;
    const ssnFilePath = `${date}_SSN.csv`;

    const ccStream = fs.createWriteStream(ccFilePath);
    const ssnStream = fs.createWriteStream(ssnFilePath);

    ccStream.write('Name, Credit Card\n');
    ssnStream.write('Name, SSN\n');

    try {
        // Read and parse the JSON file
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData);

        data.forEach((item) => {
            if (item.creditcard) {
                ccStream.write(`${item.name}, ${item.creditcard}\n`);
            }
            ssnStream.write(`${item.name}, ${item.ssn}\n`);
        });

        console.log(`CSV files generated: ${ccFilePath}, ${ssnFilePath}`);
    } catch (error) {
        console.error('Error reading or processing the file:', error.message);
    } finally {
        ccStream.end();
        ssnStream.end();
    }
}

// Get the file path from the command-line arguments
const filePath = process.argv[2];

if (!filePath) {
    console.error('Please provide the path to the JSON file as an argument.');
    process.exit(1);
}

generateCsv(filePath);