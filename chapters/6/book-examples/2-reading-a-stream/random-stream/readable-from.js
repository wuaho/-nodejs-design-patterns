/**
 * You can easily create Readable stream instances from arrays or other iterable objects
(that is, generators, iterators, and async iterators) using the Readable.from() helper.
In order to get accustomed with this helper, let's look at a simple example where we
convert data from an array into a Readable stream:
 */
import { Readable } from "stream";
const mountains = [
  { name: "Everest", height: 8848 },
  { name: "K2", height: 8611 },
  { name: "Kangchenjunga", height: 8586 },
  { name: "Lhotse", height: 8516 },
  { name: "Makalu", height: 8481 },
];
const mountainsStream = Readable.from(mountains);
mountainsStream.on("data", (mountain) => {
  console.log(`${mountain.name.padStart(14)}\t${mountain.height}m`);
});

/** TIP
 * 
 * Try not to instantiate large arrays in memory. Imagine if, in the
previous example, we wanted to list all the mountains in the
world. There are about 1 million mountains, so if we were to
load all of them in an array upfront, we would allocate a quite
significant amount of memory. Even if we then consume the
data in the array through a Readable stream, all the data has
already been preloaded, so we are effectively voiding the memory
efficiency of streams. It's always preferable to load and consume
the data in chunks, and you could do so by using native streams
such as fs.createReadStream, by building a custom stream, or
by using Readable.from with lazy iterables such as generators,
iterators, or async iterators. 
 */
