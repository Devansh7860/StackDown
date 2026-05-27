const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /bg-\[\#09090B\]/g, replace: 'bg-background' },
  { search: /bg-\[\#111113\]/g, replace: 'bg-card' },
  { search: /bg-\[\#18181B\]/g, replace: 'bg-secondary' },
  { search: /bg-\[\#27272A\]/g, replace: 'bg-muted' },
  { search: /text-\[\#FAFAFA\]/g, replace: 'text-foreground' },
  { search: /text-\[\#A1A1AA\]/g, replace: 'text-muted-foreground' },
  { search: /text-\[\#71717A\]/g, replace: 'text-muted-foreground' },
  { search: /text-\[\#52525B\]/g, replace: 'text-muted-foreground' },
  { search: /text-\[\#3F3F46\]/g, replace: 'text-muted-foreground' },
  { search: /border-\[\#1E1E21\]/g, replace: 'border-border' },
  { search: /border-\[\#27272A\]/g, replace: 'border-border' },
  { search: /border-\[\#3F3F46\]/g, replace: 'border-muted' },
  { search: /fill-\[\#FAFAFA\]/g, replace: 'fill-foreground' },
  { search: /fill-\[\#A1A1AA\]/g, replace: 'fill-muted-foreground' },
  { search: /fill-\[\#71717A\]/g, replace: 'fill-muted-foreground' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

walk('.').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated theme classes in ' + file);
  }
});
