const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('import Link from "next/navigation"')) {
        content = content.replace(/import Link from "next\/navigation";/g, 'import Link from "next/link";');
        fs.writeFileSync(p, content, 'utf8');
        console.log('Updated:', p);
      }
    }
  }
}

walk('src');
console.log('All files processed!');
