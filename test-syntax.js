const fs = require('fs');
const code = fs.readFileSync('./src/App.jsx', 'utf-8');

// Check for common syntax errors
const issues = [];

// Check for balanced braces
let braces = 0, brackets = 0, parens = 0;
for (const char of code) {
  if (char === '{') braces++;
  if (char === '}') braces--;
  if (char === '[') brackets++;
  if (char === ']') brackets--;
  if (char === '(') parens++;
  if (char === ')') parens--;
}

if (braces !== 0) issues.push(`Unbalanced braces: ${braces}`);
if (brackets !== 0) issues.push(`Unbalanced brackets: ${brackets}`);
if (parens !== 0) issues.push(`Unbalanced parens: ${parens}`);

// Check for unclosed JSX tags
const jsxTagPattern = /<([A-Z][a-zA-Z0-9]*)\s[^>]*>/g;
let match;
while ((match = jsxTagPattern.exec(code)) !== null) {
  const tag = match[1];
  const closePattern = new RegExp(`</${tag}>`);
  if (!closePattern.test(code)) {
    issues.push(`Unclosed JSX tag: <${tag}>`);
  }
}

if (issues.length === 0) {
  console.log("✓ No obvious syntax errors found");
} else {
  console.log("Issues found:");
  issues.forEach(i => console.log("  - " + i));
}
