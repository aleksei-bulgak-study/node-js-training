import fs from 'fs';
import path from 'path';
import csv from 'csvtojson/v2';
import split from 'split';
import os from 'os';

const rootFolder = path.resolve('.');
const filePath = './assets/task1.2/csv/';

const csvFile = path.join(rootFolder, filePath, 'nodejs-hw1-ex1.csv');
const destinationFile = path.join(rootFolder, filePath, 'output.txt');

const convertCsvToJson = () => {
  const readableStream = fs.createReadStream(csvFile);
  const writableStream = fs.createWriteStream(destinationFile);

  readableStream.on('error', (error) => {
    console.error('Failed to load file due to error', error);
  });
  writableStream.on('error', (error) => {
    console.error('Failed to write into file due to error', error);
  });
  readableStream.on('close', () => writableStream.end());

  readableStream
    .pipe(split(new RegExp(`(${os.EOL})`)))
    .pipe(
      csv({
        noheader: false,
        alwaysSplitAtEOL: true,
      }),
    )
    .pipe(writableStream);
};

export default convertCsvToJson;
