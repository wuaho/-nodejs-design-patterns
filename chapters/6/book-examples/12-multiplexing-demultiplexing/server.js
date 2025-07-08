// SERVER SIDE - DEMULTIPLEXING

import { createWriteStream } from "fs";
import { createServer } from "net";

/**
 * The following  code might look complicated, but it is not. Thanks to the features of
Node.js Readable streams, we can easily implement the demultiplexing of our little
protocol as follows:

1. We start reading from the stream using the non-flowing mode.

2. First, if we have not read the channel ID yet, we try to read 1 byte from the
stream and then transform it into a number.

3. The next step is to read the length of the data. We need 4 bytes for that, so
it's possible (even if unlikely) that we don't have enough data in the internal
buffer, which will cause the this.read() invocation to return null. In such
a case, we simply interrupt the parsing and retry at the next readable event.

4. When we can finally also read the data size, we know how much data to pull
from the internal buffer, so we try to read it all.

5. When we read all the data, we can write it to the right destination channel,
making sure that we reset the currentChannel and currentLength variables
(these will be used to parse the next packet).

6. Lastly, we make sure to end all the destination channels when the source
channel ends
 */

function demultiplexChannel(source, destinations) {
  let currentChannel = null;
  let currentLength = null;
  source
    .on("readable", () => {
      // (1)
      let chunk;
      if (currentChannel === null) {
        // (2)
        chunk = source.read(1);
        currentChannel = chunk && chunk.readUInt8(0);
      }
      if (currentLength === null) {
        // (3)
        chunk = source.read(4);
        currentLength = chunk && chunk.readUInt3;

        if (currentLength === null) {
          return null;
        }
      }
      chunk = source.read(currentLength); // (4)
      if (chunk === null) {
        return null;
      }
      console.log(`Received packet from: ${currentChannel}`);
      destinations[currentChannel].write(chunk); // (5)
      currentChannel = null;
      currentLength = null;
    })
    .on("end", () => {
      // (6)
      destinations.forEach((destination) => destination.end());
      console.log("Source channel closed");
    });
}

// Now that we can demultiplex the source stream, let's put our new function to work:
const server = createServer((socket) => {
  const stdoutStream = createWriteStream("stdout.log");
  const stderrStream = createWriteStream("stderr.log");
  demultiplexChannel(socket, [stdoutStream, stderrStream]);
});
server.listen(3000, () => console.log("Server started"));
