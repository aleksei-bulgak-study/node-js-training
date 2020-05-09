const fs = require('fs');
const path = require('path');
const os = require('os');
const csv = require('csvtojson');

const filePath = '../../assets/task1.2/csv/';
const csvFile = path.join(__dirname, filePath, 'nodejs-hw1-ex1.csv');
const destinationFile = path.join(__dirname, filePath, 'output.txt');

const readableStream = fs.createReadStream(csvFile);
const writableStream = fs.createWriteStream(destinationFile);

readableStream.on('error', (error) => console.error('Failed to load file due to error', error));
writableStream.on('error', (error) => console.error('Failed to write into file due to error', error));

const onError = (error) => {
  console.log(error);
  readableStream.close();
  writableStream.close();
};

const onSuccess = () => {
  readableStream.close();
  writableStream.close();
};

const writeLine = (json) => writableStream.write(JSON.stringify(json) + os.EOL, 'utf-8');

const writeLineWithTimeout = (json, timeout = 0) => {
  writeLine(json);
  return new Promise((res) => {
    setTimeout(() => res(), timeout);
  });
};

csv()
  .fromStream(readableStream)
  .subscribe((json) => writeLine(json), onError, onSuccess);