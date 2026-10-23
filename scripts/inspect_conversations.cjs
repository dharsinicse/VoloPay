const fs = require('fs');
const content = fs.readFileSync('CONVERSATIONS.md', 'utf8');

const sections = content.split(/^## /m).slice(1);
console.log('Total conversation sections:', sections.length);

sections.forEach((sec, idx) => {
  const lines = sec.trim().split('\n');
  const header = lines[0]; // e.g. "C01 - call"
  const sourceIdLine = lines.find(l => l.startsWith('Source ID:'));
  const sourceTimeLine = lines.find(l => l.startsWith('Source time:'));
  const titleLine = lines[3] || '';
  const firstTurnOrSnippet = lines.slice(4).filter(l => l.trim().length > 0)[0] || '';
  console.log(`[${idx+1}] ${header} | ID: ${sourceIdLine?.replace('Source ID: ', '')} | ${titleLine.substring(0, 40)} | snippet: ${firstTurnOrSnippet.substring(0, 70)}...`);
});
