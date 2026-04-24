const AdmZip = require('adm-zip');
const fs = require('fs');

async function extractZip(zipPath) {
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();
  
  const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rb', '.php', '.cpp', '.c', '.cs', '.rs', '.html', '.css', '.json', '.md'];
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory) continue;
    if (entry.header.size > 500000) continue;
    if (entry.entryName.includes('node_modules')) continue;
    if (!codeExtensions.some(ext => entry.entryName.endsWith(ext))) continue;
    
    try {
      files.push({
        path: entry.entryName,
        content: entry.getData().toString('utf8')
      });
      if (files.length >= 50) break;
    } catch (e) {}
  }

  // Delete zip after extraction
  fs.unlinkSync(zipPath);
  
  return files;
}

module.exports = { extractZip };
