/*
4.2 List files recursively: Write listNestedFiles(), a callback-style function
that takes, as the input, the path to a directory in the local filesystem and that
asynchronously iterates over all the subdirectories to eventually return a list
of all the files discovered. Here is what the signature of the function should
look like:
function listNestedFiles (dir, cb) {  //...  }
Bonus points if you manage to avoid callback hell. Feel free to create
additional helper functions if needed.
*/

import fs from "fs";

function listNestedFiles(dir, cb) {
  const result = [];

  fs.readdir(dir, { withFileTypes: true, recursive: true }, (error, files) => {
    if (error) return cb(error);

    files.forEach((file) => {
      if (!file.isDirectory()) result.push(`${file.path}/${file.name}`);
    });

    return cb(null, result);
  });
}

listNestedFiles("myDir", (err, files) => {
  if (err) {
    console.log("Error:", err);
  }

  console.log("Archivos encontrados:", files);
});
