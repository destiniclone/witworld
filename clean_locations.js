const fs = require('fs');
let code = fs.readFileSync('App.jsx', 'utf-8');

// List of locations to remove (contains country name)
const toRemove = [
  '["Belize City"',
  '["Djibouti City"',
  '["Guatemala City"',
  '["Kuwait City"',
  '["Luxembourg City"',
  '["Melaka City"',
  '["Mexico City"',
  '["Panama City"',
  '["Cebu City"',
];

toRemove.forEach(loc => {
  // Find and remove the location entry with all its coordinates and type
  const pattern = new RegExp(loc + '[^\\]]*\\][^,]*,\\s*');
  code = code.replace(pattern, '');
});

fs.writeFileSync('App.jsx', code);
console.log('Cleaned locations containing country names');
