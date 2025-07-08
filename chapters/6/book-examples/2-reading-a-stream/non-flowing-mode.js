/**
 * The non-flowing or paused mode is the default pattern for reading from a Readable
stream. It involves attaching a listener to the stream for the readable event, which
signals the availability of new data to read. Then, in a loop, we read the data
continuously until the internal buffer is emptied. This can be done using the read()
method, which synchronously reads from the internal buffer and returns a Buffer
object representing the chunk of data.

Using this approach, the data is imperatively pulled from the stream on demand.
 */

process.stdin
  .on("readable", () => {
    let chunk;
    console.log("New data available");
    while ((chunk = process.stdin.read()) !== null) {
      console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString()}"`);
    }
  })
  .on("end", () => console.log("End of stream"));

// Way to rewrite the same function as an async iterator
async function main() {
  for await (const chunk of process.stdin) {
    console.log("New data available");
    console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString()}"`);
  }
  console.log("End of stream");
}
