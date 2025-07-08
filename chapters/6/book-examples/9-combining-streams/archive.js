/**
 * We can now use these combined streams as if they were black boxes, for example, to
create a small application that archives a file by compressing and encrypting it.

Note how we don't have to worry about how many steps there are within
archiveFile. In fact, we just treat it as a single stream within our current pipeline.
This makes our combined stream easily reusable in other contexts.
 */

import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream";
import { randomBytes } from "crypto";
import { createCompressAndEncrypt } from "./combined-streams.js";

const [, , password, source] = process.argv;
const iv = randomBytes(16);
const destination = `${source}.gz.enc`;

pipeline(
  createReadStream(source),
  createCompressAndEncrypt(password, iv),
  createWriteStream(destination),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`${destination} created with iv: ${iv.toString("hex")}`);
  }
);

// Use: node archive.js mypassword /path/to/a/file.txt
