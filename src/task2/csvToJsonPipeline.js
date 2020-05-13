import fs from 'fs';
import path from 'path';
import csv from 'csvtojson/v2';
import { Writable } from 'stream';

const rootFolder = path.resolve('.');
const filePath = './assets/task1.2/csv/';

const csvFile = path.join(rootFolder, filePath, 'nodejs-hw1-ex1.csv');
const destinationFile = path.join(rootFolder, filePath, 'output.txt');

const convertCsvToJson = () => {
  const readableStream = fs.createReadStream(csvFile, { highWaterMark: 64 });
  const writableStream = fs.createWriteStream(destinationFile);

  readableStream.on('error', (error) => {
    console.error('Failed to load file due to error', error);
  });
  writableStream.on('error', (error) => {
    console.error('Failed to write into file due to error', error);
  });
  readableStream.on('close', () => writableStream.end());

  const customWriterWithTimeout = new Writable({
    write(chunk, encoding, callback) {
      console.log('write chunk', chunk.toString());

      writableStream.write(chunk, encoding);
      callback();
    },
  });

  readableStream
    .pipe(
      csv({
        headers: ['Book', 'Author', 'Amount', 'Price'],
        ignoreColumns: /(Amount)/,
        alwaysSplitAtEOL: true,
      }).on('data', (data) => console.log('csvToJson', data.toString())),
    )
    .pipe(customWriterWithTimeout);
};

export default convertCsvToJson;
