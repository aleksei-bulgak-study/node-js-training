import fs from 'fs';
import path, { __dirname } from 'path';
import os from 'os';
import csv from 'csvtojson';

const filePath = '../../assets/task1.2/csv/';
const csvFile = path.join(__dirname, filePath, 'nodejs-hw1-ex1.csv');
const destinationFile = path.join(__dirname, filePath, 'output.txt');

const readableStream = fs.createReadStream(csvFile);
const writableStream = fs.createWriteStream(destinationFile);

readableStream.on('error', (error) => {
  console.error('Failed to load file due to error', error);
});
writableStream.on('error', (error) => {
  console.error('Failed to write into file due to error', error);
});

const onError = (error) => {
  console.log(error);
  readableStream.close();
  writableStream.close();
};

const onSuccess = () => {
  readableStream.close();
  writableStream.close();
};

const writeLine = (json) => {
  writableStream.write(JSON.stringify(json) + os.EOL, 'utf-8');
};

csv()
  .fromStream(readableStream)
  .subscribe((json) => writeLine(json), onError, onSuccess);
