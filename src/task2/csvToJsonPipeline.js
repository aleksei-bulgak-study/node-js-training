const fs = require('fs');
const path = require('path');
const os = require('os');
const csv = require('csvtojson');
const { pipeline, Writable } = require('stream');
const split = require('split');

const filePath = '../../assets/task1.2/csv/';
const csvFile = path.join(__dirname, filePath, 'nodejs-hw1-ex1.csv');
const destinationFile = path.join(__dirname, filePath, 'output.txt');

const readableStream = fs.createReadStream(csvFile);
const writableStream = fs.createWriteStream(destinationFile);

readableStream.on('error', (error) => console.error('Failed to load file due to error', error));
writableStream.on('error', (error) => console.error('Failed to write into file due to error', error));

readableStream.on('close', () => writableStream.end());

const customWriterWithTimeout = new Writable({
  write(chunk, encoding, callback) {
    // console.log(chunk.toString());
    writableStream.write(chunk, encoding);
    callback();
  },
  writev(chunks, callback) {
    console.log('all at once');
    console.log(chunks);
    callback();
  }
})

pipeline(
  readableStream,
  split(),
  csv(),
  customWriterWithTimeout,
  (error) => console.log(error)
);

// readableStream
//   .pipe(split())
//   .pipe(csv())
//   .pipe(customWriterWithTimeout);