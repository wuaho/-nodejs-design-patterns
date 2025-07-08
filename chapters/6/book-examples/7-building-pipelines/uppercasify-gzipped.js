// Code explanation:
// 1. We are importing the necessary dependencies from zlib and the stream
// modules.
// 2. We create a simple Transform stream that makes every chunk uppercase.
// 3. We define our pipeline, where we list all the stream instances in order.
// 4. We add a callback to monitor the completion of the stream. In the event of
// an error, we print the error in the standard error interface, and we exit with
// error code 1.

import { createGzip, createGunzip } from "zlib"; // (1)
import { Transform, pipeline } from "stream";

const uppercasify = new Transform({
  // (2)
  transform(chunk, enc, cb) {
    this.push(chunk.toString().toUpperCase());
  },
});

pipeline(
  // (3)
  process.stdin,
  createGunzip(),
  uppercasify,
  createGzip(),
  process.stdout,
  (err) => {
    // (4)
    if (err) {
      console.error(err);
      process.exit(1);
    }
  }
);

// We could test this script with the following command:
// echo 'Hello World!' | gzip | node uppercasify-gzipped.js | gunzip

//Why using pipelines?
// 1. Better error handling, without pipelines we would have to do:
// stream1
//   .on("error", () => {})
//   .pipe(stream2)
//   .on("error", () => {});

// this is clearly not ideal
//
// 2. In the event of an error, the failing stream is not propery destroyed which might leave dangling resources and leak memory.
// So the code should look like:
// function handleError(err) {
//   console.error(err);
//   stream1.destroy();
//   stream2.destroy();
// }
// stream1.on("error", handleError).pipe(stream2).on("error", handleError);
// Which makes it tedious to manage
