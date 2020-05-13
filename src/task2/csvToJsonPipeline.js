import fs from 'fs';
import path from 'path';
import csv from 'csvtojson/v2';
import { pipeline, Writable } from 'stream';

const filePath = '../../assets/task1.2/csv/';
// eslint-disable-next-line no-undef
const csvFile = path.join(__dirname, filePath, 'nodejs-hw1-ex1.csv');
// eslint-disable-next-line no-undef
const destinationFile = path.join(__dirname, filePath, 'output.txt');

const readableStream = fs.createReadStream(csvFile);
const writableStream = fs.createWriteStream(destinationFile);

readableStream.on('data', (data) => console.log(data.toString()));

readableStream.on('error', (error) => {
  console.error('Failed to load file due to error', error);
});
writableStream.on('error', (error) => {
  console.error('Failed to write into file due to error', error);
});

readableStream.on('close', () => writableStream.end());

const customWriterWithTimeout = new Writable({
  write(chunk, encoding, callback) {
    console.log('chunck');
    console.log(chunk.toString());

    writableStream.write(chunk, encoding);
    callback();
  },
  writev(chunks, callback) {
    console.log('all at once');
    console.log(chunks);
    callback();
  },
});

pipeline(readableStream, csv(), customWriterWithTimeout, (error) => {
  console.log(error);
});

// readableStream
//   .pipe(split())
//   .pipe(csv())
//   .pipe(customWriterWithTimeout);
