import { createReadStream, createWriteStream } from "fs";
import split from "split";

const dest = process.argv[2];
const sources = process.argv.slice(3);

const destStream = createWriteStream(dest);

let endCount = 0;
for (const source of sources) {
  const sourceStream = createReadStream(source, { highWaterMark: 16 });
  sourceStream.on("end", () => {
    if (++endCount === sources.length) {
      destStream.end();
      console.log(`${dest} created`);
    }
  });
  sourceStream
    .pipe(split((line) => line + "\n"))
    .pipe(destStream, { end: false });
}

// Use: node merge-lines.js <destination> <source1> <source2> <source3> ...

/* 
In the preceding code, we created a Readable stream for every source file. Then, for
each source stream, we attached an end listener, which will terminate the destination
stream only when all the files have been read completely. Finally, we piped every
source stream to split(), a Transform stream that makes sure that we produce a
chunk for every line of text, and finally, we piped the results to our destination
stream. This is when the real merge happens. We are piping multiple source streams
into one single destination.
*/
