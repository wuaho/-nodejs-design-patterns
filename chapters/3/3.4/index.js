import { EventEmitter } from "events";

const DivisibleBy5Error = new Error("Timestamp is divisible by 5.");

function ticker(number, callback) {
  const emitter = new EventEmitter();

  recursion(number, emitter, 0, callback);

  return emitter;
}

function recursion(number, emitter, ticks, callback) {
  if (Date.now() % 5 === 0) {
    process.nextTick(() => emitter.emit("error", DivisibleBy5Error));
    return callback(DivisibleBy5Error, ticks);
  }

  if (number <= 0) {
    return callback(null, ticks);
  }

  process.nextTick(() => emitter.emit("tick"));

  setTimeout(() => {
    return recursion(number - 50, emitter, ticks + 1, callback);
  }, 50);
}

ticker(1000, (_err, ticks) =>
  console.log(`Emitted ${ticks} ${ticks > 1 ? "ticks" : "tick"}.`)
).on("tick", () => console.log("Tick"));
