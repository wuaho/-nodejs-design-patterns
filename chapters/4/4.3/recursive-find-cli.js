import { TaskQueue } from "./task-queue.js";
import { recursiveFind } from "./recursive-find.js";

if (process.argv < 4) {
  console.log(
    "Use: node recursive-find-cli.js <dirname> <keyword> <concurrency>"
  );
  process.exit(1);
}

const dir = process.argv[2];
const keyword = process.argv[3];
const concurrency = Number.parseInt(process.argv[4], 10) || 2;

const queue = new TaskQueue(concurrency);

recursiveFind(dir, keyword, queue, (err, files) => {
  if (err) return console.log("Error finding files: ", err.message);
  console.log(`Keyword "${keyword}" found in the following files:`, files);
});
