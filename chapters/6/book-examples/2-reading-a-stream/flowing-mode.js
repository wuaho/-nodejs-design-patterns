/**
Another way to read from a stream is by attaching a listener to the data event. This
will switch the stream into using flowing mode, where the data is not pulled using
read(), but instead is pushed to the data listener as soon as it arrives.

Flowing mode offers less flexibility to control the flow of data compared to nonflowing mode. 
The default operating mode for streams is non-flowing, so to enable
flowing mode, it's necessary to attach a listener to the data event or explicitly invoke
the resume() method. To temporarily stop the stream from emitting data events,
we can invoke the pause() method, causing any incoming data to be cached in the
internal buffer. Calling pause() will switch the stream back to non-flowing mode.
 */

process.stdin
  .on("data", (chunk) => {
    console.log("New data available");
    console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString()}"`);
  })
  .on("end", () => console.log("End of stream"));
