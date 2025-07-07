/**
 * 5.2 TaskQueue with promises: Migrate the TaskQueue class internals from
promises to async/await where possible. Hint: you won't be able to use
async/await everywhere.
 */

import { EventEmitter } from "events";

export class TaskQueue extends EventEmitter {
  constructor(concurrency) {
    super();
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  runTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        return task().then(resolve, reject);
      });
      process.nextTick(this.next.bind(this));
    });
  }
  async next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      try {
        await task();
      } catch (error) {
        reject(error);
      } finally {
        this.running--;
        this.next();
      }
      this.running++;
    }
  }
}
