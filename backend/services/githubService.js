const axios = require('axios');

async function fetchRepo(url) {
  // Parse GitHub URL
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  
  const [, owner, repoRaw] = match;
  const repo = repoRaw.replace(/\.git$/, '').replace(/\/$/, '');

  const headers = {};
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  // Get default branch
  const repoInfo = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );
  const branch = repoInfo.data.default_branch;

  // Get tree (all files)
  const tree = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  );

  const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rb', '.php', '.cpp', '.c', '.cs', '.rs', '.html', '.css', '.json', '.md'];
  const files = [];
  
  const filesToFetch = tree.data.tree
    .filter(item => 
      item.type === 'blob' &&
      item.size < 500000 && // Skip files > 500KB
      codeExtensions.some(ext => item.path.endsWith(ext)) &&
      !item.path.includes('node_modules') &&
      !item.path.includes('dist/') &&
      !item.path.includes('build/')
    )
    .slice(0, 50); // Limit to 50 files to avoid API rate limits

  for (const item of filesToFetch) {
    try {
      const content = await axios.get(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`
      );
      files.push({
        path: item.path,
        content: typeof content.data === 'string' ? content.data : JSON.stringify(content.data)
      });
    } catch (e) {
      console.log(`Skipped ${item.path}`);
    }
  }

  return files;
}

module.exports = { fetchRepo };
