const fs = require('fs');
const path = require('path');
const os = require('os');
const csv = require('csvtojson');

const filePath = '../../assets/task1.2/';
const csvFile = path.join(__dirname, filePath, 'nodejs-hw1-ex1.csv');
const destinationFile = path.join(__dirname, filePath, 'output.txt');

const readableStream = fs.createReadStream(csvFile);
const writableStream = fs.createWriteStream(destinationFile);

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
