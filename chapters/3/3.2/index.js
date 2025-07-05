/* Write a function that accepts a number and a callback as the
arguments. The function will return an EventEmitter that emits an event
called tick every 50 milliseconds until the number of milliseconds is passed
from the invocation of the function. The function will also call the callback
when the number of milliseconds has passed, providing, as the result, the total
count of tick events emitted. Hint: you can use setTimeout() to schedule
another setTimeout() recursively. */

import { EventEmitter } from "events";

function ticker(number, callback) {
  const emitter = new EventEmitter();

  recursion(number, emitter, 0, callback);

  return emitter;
}

function recursion(number, emitter, ticks, callback) {
  if (number <= 0) {
    return callback(null, ticks);
  }

  setTimeout(() => {
    emitter.emit("tick");
    return recursion(number - 50, emitter, ticks + 1, callback);
  }, 50);
}

ticker(1000, (_err, ticks) =>
  console.log(`Emitted ${ticks} ${ticks > 1 ? "ticks" : "tick"}.`)
).on("tick", () => console.log("Tick"));
