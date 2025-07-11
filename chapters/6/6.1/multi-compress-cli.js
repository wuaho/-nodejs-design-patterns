/* 6.1 Data compression efficiency: Write a command-line script that takes a
file as input and compresses it using the different algorithms available in the
zlib module (Brotli, Deflate, Gzip). You want to produce a summary table
that compares the algorithm's compression time and compression efficiency
on the given file. Hint: This could be a good use case for the fork pattern, but
remember that we made some important performance considerations when
we discussed it earlier in this chapter.
*/

// node multi-compress-cli.js [file]
// output:
// Algorithm                   Brotli      Deflate     Gzip
// Compression-time               X           X         X
// Compression-efficiency         X           X         X

import { multiCompress } from "./multi-compress.js";

if (process.argv.length < 3) {
  console.log("Use: <node index-cli.js [file]");
  process.exit(1);
}

const filename = process.argv[2];
multiCompress(filename);
