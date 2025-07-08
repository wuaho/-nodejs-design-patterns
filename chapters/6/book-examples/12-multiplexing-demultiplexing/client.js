// CLIENT SIDE - MULTIPLEXING

import { fork } from "child_process";
import { connect } from "net";

/**
 * The multiplexChannels() function takes in, as input, the source streams to be
multiplexed and the destination channel, and then it performs the following steps:

1. For each source stream, it registers a listener for the readable event, where
we read the data from the stream using the non-flowing mode.

2. When a chunk is read, we wrap it into a packet that contains, in order, 1 byte
(UInt8) for the channel ID, 4 bytes (UInt32BE) for the packet size, and then the
actual data.

3. When the packet is ready, we write it into the destination stream.

4. Finally, we register a listener for the end event so that we can terminate the
destination stream when all the source streams have ended.
 */

function multiplexChannels(sources, destination) {
  let openChannels = sources.length;
  for (let i = 0; i < sources.length; i++) {
    sources[i]
      .on("readable", function () {
        // (1)
        let chunk;
        while ((chunk = this.read()) !== null) {
          const outBuff = Buffer.alloc(1 + 4 + chunk.length); // (2)
          outBuff.writeUInt8(i, 0);
          outBuff.writeUInt32BE(chunk.length, 1);
          chunk.copy(outBuff, 5);
          console.log(`Sending packet to channel: ${i}`);
          destination.write(outBuff); // (3)
        }
      })
      .on("end", () => {
        // (4)
        if (--openChannels === 0) {
          destination.end();
        }
      });
  }
}

const socket = connect(3000, () => {
  // (1)
  const child = fork(
    // (2)
    process.argv[2],
    process.argv.slice(3),
    { silent: true }
  );
  multiplexChannels([child.stdout, child.stderr], socket); // (3)
});

/* 
In this last code fragment, we perform the following operations:

1. We create a new TCP client connection to the address localhost:3000.

2. We start the child process by using the first command-line argument as the
path, while we provide the rest of the process.argv array as arguments for
the child process. We specify the option {silent: true} so that the child
process does not inherit stdout and stderr of the parent.
 
3. Finally, we take stdout and stderr of the child process and we multiplex
them into the socket's Writable stream using the mutiplexChannels()
function.
*/
