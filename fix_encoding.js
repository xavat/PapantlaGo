const fs = require('fs');
const path = require('path');

const replacements = {
    "á": "á",
    "é": "é",
    "í": "í",
    "ó": "ó",
    "ú": "ú",
    "ñ": "ñ",
    "Ã\u0081": "Á",
    "Ã\u0089": "É",
    "Ã\u008D": "Í",
    "Ã\u0093": "Ó",
    "Ã\u009A": "Ú",
    "Ã\u0091": "Ñ",
    "–": "–",
    "—": "—",
    "“": "“",
    "â€\u009d": "”",
    "‘": "‘",
    "’": "’"
};

function fixFile(filepath) {
    try {
        let content = fs.readFileSync(filepath, 'utf8');
        let newContent = content;
        
        for (const [key, value] of Object.entries(replacements)) {
            newContent = newContent.split(key).join(value);
        }

        // Catch the remaining "Ã " (capital A with tilde) which often means "Á" or just mangled "á"
        // But let's be conservative first.
        
        if (newContent !== content) {
            fs.writeFileSync(filepath, newContent, 'utf8');
            console.log(`Fixed: ${filepath}`);
        }
    } catch (e) {
        console.error(`Error fixing ${filepath}: ${e.message}`);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                walk(fullPath);
            }
        } else if (/\.(tsx|ts|js|jsx|json|md)$/.test(file)) {
            fixFile(fullPath);
        }
    }
}

walk('.');
console.log('Finished fixing encoding.');
