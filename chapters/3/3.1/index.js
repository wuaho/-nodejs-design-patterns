// A simple event
import { EventEmitter } from "events";
import { readFile } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    const fullPath = path.join(__dirname, file);
    this.files.push(fullPath);
    return this;
  }

  find() {
    process.nextTick(() => this.emit("start", this.files)); // Se ejecuta inmediatamente despues de la operacion actual, antes de que el bucle de eventos continue con I/O

    // De la siguiente manera se ejecutaria despues de que el bucle de eventos complete su fase actual y se procesen las operaciones I/O.
    // setImmediate(() => this.emit("start", this.files)); //

    for (const file of this.files) {
      readFile(file, "utf8", (err, content) => {
        if (err) {
          return this.emit("error", err);
        }
        this.emit("fileread", file);

        const match = content.match(this.regex);
        if (match) {
          match.forEach((elem) => this.emit("found", file, elem));
        }
      });
    }
    return this;
  }
}

const findRegexInstance = new FindRegex(/hello \w+/);
findRegexInstance
  .addFile("fileA.txt")
  .addFile("fileB.txt")
  .find()
  .on("found", (file, match) =>
    console.log(`Matched "${match}" in file ${file}`)
  )
  .on("error", (err) => console.log(`Error emitted ${err.message}`))
  .once(
    "start",
    (files) => console.log(`Lets search in these files: ${files}`) // Nueva linea para probar el start event
  );
