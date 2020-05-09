const readline = require('readline');
const os = require('os');

const readLineStream = readline.createInterface(process.stdin);
const writeLineStream = process.stdout;

function reverseText(input) {
  if (input && typeof input === 'string') {
    return input.split('').reverse().join('');
  }
  return input;
}

readLineStream.on('line', (text) => {
  const reversedText = reverseText(text);
  writeLineStream.write(reversedText);
  writeLineStream.write(os.EOL);
});

readLineStream.on('close', () => writeLineStream.destroy());
