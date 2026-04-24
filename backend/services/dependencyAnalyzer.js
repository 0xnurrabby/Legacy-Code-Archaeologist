function buildGraph(files) {
  const graph = {};
  
  for (const file of files) {
    const imports = extractImports(file.content);
    graph[file.path] = imports;
  }
  
  // Convert to readable text format
  let output = 'DEPENDENCY GRAPH:\n\n';
  for (const [file, deps] of Object.entries(graph)) {
    if (deps.length > 0) {
      output += `📄 ${file}\n`;
      deps.forEach(d => output += `   └─→ ${d}\n`);
      output += '\n';
    }
  }
  
  return output;
}

function extractImports(content) {
  const imports = [];
  const patterns = [
    /require\(['"](.+?)['"]\)/g,
    /import .+? from ['"](.+?)['"]/g,
    /import ['"](.+?)['"]/g,
    /from\s+['"](.+?)['"]\s+import/g
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (!match[1].startsWith('.') && !match[1].startsWith('/')) continue;
      imports.push(match[1]);
    }
  }
  
  return [...new Set(imports)];
}

module.exports = { buildGraph };
