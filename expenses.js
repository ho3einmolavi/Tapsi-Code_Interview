const fs = require('fs');

// Read the text file
fs.readFile('expenses.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Split the text into an array of lines
    const lines = data.split('\n');

    // Filter lines containing the word "cigar"
    const cigarLines = lines.filter(line => line.toLowerCase().includes('fruit'));
    // Output the filtered lines
    cigarLines.forEach(line => console.log(line));
});
