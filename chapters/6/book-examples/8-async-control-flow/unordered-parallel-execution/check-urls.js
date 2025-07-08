import { pipeline } from "stream";
import { createReadStream, createWriteStream } from "fs";
import split from "split";
import superagent from "superagent";
import { ParallelStream } from "./parallel-stream.js";

pipeline(
  createReadStream(process.argv[2]), // (1)
  split(), // (2)
  new ParallelStream(async (url, enc, push, done) => {
    // (3)
    if (!url) {
      return done();
    }
    try {
      await superagent.head(url, { timeout: 5 * 1000 });
      push(`${url} is up\n`);
    } catch (err) {
      push(`${url} is down\n`);
    }
    done();
  }),
  createWriteStream("results.txt"), // (4)
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("All urls have been checked");
  }
);

/**
 * 1. First, we create a Readable stream from the file given as input.
 * 
2. We pipe the contents of the input file through split (nodejsdp.link/split),
a Transform stream that ensures each line is emitted in a different chunk.

3. Then, it's time to use our ParallelStream to check the URL. We do this by
sending a head request and waiting for a response. When the operation
completes, we push the result down the stream.

4. Finally, all the results are piped into a file, results.txt.
 */
