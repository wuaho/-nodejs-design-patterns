import { PassThrough } from "stream";

let bytesWritten = 0;

const monitor = new PassThrough();

monitor.on("data", (chunk) => {
  bytesWritten += chunk.length;
});

monitor.on("finish", () => {
  console.log(`${bytesWritten} bytes written`);
});

monitor.write("Hello!");
monitor.end();

// For instance, if we wanted to monitor how many bytes are
// written to disk in our first file compression example of this chapter, we could easily
// achieve that by doing something like this:

createReadStream(filename)
  .pipe(createGzip())
  .pipe(monitor) // <-
  .pipe(createWriteStream(`${filename}.gz`));

// The beauty of this approach is that we didn't have to touch any of the other existing
// streams in the pipeline, so if we need to observe other parts of the pipeline (for
// instance, imagine we want to know the number of bytes of the uncompressed data),
// we can move monitor around with very little effort.
