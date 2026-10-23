const fs = require('fs');
const content = fs.readFileSync('CONVERSATIONS.md', 'utf8');
const sections = content.split(/^## /m).slice(1);

sections.filter(s => s.startsWith('M')).forEach(sec => {
  const lines = sec.trim().split('\n');
  const header = lines[0];
  const title = lines[4];
  const turns = lines.filter(l => l.startsWith('**Turn '));
  console.log(`\n=== ${header} (${turns.length} turns) === ${title}`);
  // print first 2 turns and last 2 turns
  const turnIndices = [];
  lines.forEach((l, idx) => {
    if (l.startsWith('**Turn ')) turnIndices.push(idx);
  });
  if (turnIndices.length > 0) {
    console.log(lines[turnIndices[0]] + ' ' + (lines[turnIndices[0]+2] || ''));
    if (turnIndices.length > 1) {
      const last = turnIndices[turnIndices.length - 1];
      console.log(lines[last] + ' ' + (lines[last+2] || ''));
    }
  }
});
