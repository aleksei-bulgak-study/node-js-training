import fs from 'fs';
import path from 'path';
import os from 'os';
import csv from 'csvtojson';

const filePath = '../../assets/task1.2/';

const readableStream = fs.createReadStream(
  path.join(__dirname, filePath, 'nodejs-hw1-ex1.csv'),
);
const writableStream = fs.createWriteStream(
  path.join(__dirname, filePath, 'output.txt'),
);

const onError = (error) => {
  console.log(error);
  readableStream.close();
  writableStream.close();
};

const onSuccess = () => {
  console.log('processing finished');
  readableStream.close();
  writableStream.close();
};

const writeLine = (json) => writableStream.write(JSON.stringify(json) + os.EOL, 'utf-8');

csv()
  .fromStream(readableStream)
  .subscribe((json) => writeLine(json), onError, onSuccess);
