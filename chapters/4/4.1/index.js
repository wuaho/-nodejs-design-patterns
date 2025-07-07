/*4.1 File concatenation: Write the implementation of concatFiles(), a
callback-style function that takes two or more paths to text files in the
filesystem and a destination file:
function concatFiles (srcFile1, srcFile2, srcFile3, ... ,
dest, cb) {
// ...
}
This function must copy the contents of every source file into the destination
file, respecting the order of the files, as provided by the arguments list.
For instance, given two files, if the first file contains foo and the second
file contains bar, the function should write foobar (and not barfoo) in the
destination file. Note that the preceding example signature is not valid
JavaScript syntax: you need to find a different way to handle an arbitrary
number of arguments. For instance, you could use the rest parameters syntax
(nodejsdp.link/rest-parameters). */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// callback-style(...srcfiles, dest, cb)
export function concatFiles(...args) {
  const cb = args.pop();
  const dest = args.pop();
  const files = args;
  const destFile = path.join(__dirname, dest);

  if (files.length === 0) {
    return process.nextTick(cb);
  }

  function iterate(index) {
    if (index === files.length) {
      return cb();
    }

    const filePath = path.join(__dirname, files[index]);

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return cb(err);
      }
      fs.appendFile(destFile, data, (err) => {
        if (err) {
          return cb(err);
        }
        iterate(index + 1);
      });
    });
  }

  iterate(0);
}
