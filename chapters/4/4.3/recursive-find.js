/**
 4.3 Recursive find: Write recursiveFind(), a callback-style function that
takes a path to a directory in the local filesystem and a keyword, as per the
following signature:
function recursiveFind(dir, keyword, cb) { // ... }
The function must find all the text files within the given directory that
contain the given keyword in the file contents. The list of matching files
should be returned using the callback when the search is completed. If no
matching file is found, the callback must be invoked with an empty array.
As an example test case, if you have the files foo.txt, bar.txt, and baz.txt
in myDir and the keyword 'batman' is contained in the files foo.txt and baz.
txt, you should be able to run the following code:
recursiveFind('myDir', 'batman', console.log)
// should print ['foo.txt', 'baz.txt']
Bonus points if you make the search recursive (it looks for text files in any
subdirectory as well). Extra bonus points if you manage to perform the
search within different files and subdirectories in parallel, but be careful to
keep the number of parallel tasks under control!
 */

import fs from "fs";

const seenDirs = new Set();
export function recursiveFind(dir, keyword, queue, cb) {
  const results = [];

  queue.on("empty", () => cb(null, results));
  queue.on("error", console.error);

  visitDirectory(dir, keyword, queue, results);
}

function visitDirectory(dir, keyword, queue, results) {
  if (seenDirs.has(dir)) return;
  seenDirs.add(dir);

  queue.pushTask((done) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) return done(err);

      files.forEach((file) => {
        const fullPath = `${file.path}/${file.name}`;

        if (file.isDirectory()) {
          visitDirectory(fullPath, keyword, queue, results);
        } else if (file.isFile()) {
          queue.pushTask((next) => {
            fs.readFile(fullPath, "utf8", (err, data) => {
              if (err) return next(err);
              if (data.includes(keyword)) results.push(fullPath);

              next();
            });
          });
        }
      });
      done();
    });
  });
}
