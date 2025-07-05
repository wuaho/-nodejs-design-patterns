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

  process.nextTick(() => emitter.emit("tick")); // Incluimos el emit.("tick") en un process.nextTick() para que sea lo primero que se ejecute

  setTimeout(() => recursion(number - 50, emitter, ticks + 1, callback), 50); // Quitamos el tick del setTimeout
}

ticker(1000, (_err, ticks) =>
  console.log(`Emitted ${ticks} ${ticks > 1 ? "ticks" : "tick"}.`)
).on("tick", () => console.log("Tick"));
