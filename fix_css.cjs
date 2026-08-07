const fs = require('fs');
let lines = fs.readFileSync('src/styles/index.css', 'utf8').split('\n');

// Line numbers are 1-indexed in the viewer
// Lines 5303-5416 are the broken/duplicate section
// Line 5303 = index 5302 (0-indexed)
// Line 5416 = index 5415 (0-indexed)

// Remove lines 5303 to 5416 (indices 5302 to 5415 inclusive)
const removeStart = 5302; // index 0-based
const removeEnd = 5415;   // index 0-based, inclusive

console.log('Lines to remove:');
console.log('  From line 5303:', JSON.stringify(lines[5302]));
console.log('  To line 5416:', JSON.stringify(lines[5415]));
console.log('  Line 5417:', JSON.stringify(lines[5416]));
console.log('  Line 5418:', JSON.stringify(lines[5417]));

// Verify the correct block starts at 5418 (index 5417)
if (lines[5417] && lines[5417].trim() === '.module-back-btn {') {
  lines.splice(removeStart, removeEnd - removeStart + 1);
  fs.writeFileSync('src/styles/index.css', lines.join('\n'));
  console.log('\nSUCCESS: Removed broken duplicate block (lines 5303-5416)');
  console.log('New total lines:', lines.length);
} else {
  console.log('\nSafety check failed - line 5418 is not .module-back-btn {');
  console.log('Aborting. Manual fix needed.');
}
