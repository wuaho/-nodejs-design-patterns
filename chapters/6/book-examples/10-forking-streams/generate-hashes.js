// Let's create a small utility that outputs both the sha1 and md5 hashes of a given file.

import { createReadStream, createWriteStream } from "fs";
import { createHash } from "crypto";

const filename = process.argv[2];
const sha1Stream = createHash("sha1").setEncoding("hex");
const md5Stream = createHash("md5").setEncoding("hex");
const inputStream = createReadStream(filename);

inputStream.pipe(sha1Stream).pipe(createWriteStream(`${filename}.sha1`));

inputStream.pipe(md5Stream).pipe(createWriteStream(`${filename}.md5`));

/* 
Very simple, right? The inputStream variable is piped into sha1Stream on one side
and md5Stream on the other. There are a few things to note that happen behind the
scenes:

• Both md5Stream and sha1Stream will be ended automatically when
inputStream ends, unless we specify { end: false } as an option when
invoking pipe().

• The two forks of the stream will receive the same data chunks, so we must
be very careful when performing side-effect operations on the data, as that
would affect every stream that we are sending data to.

• Backpressure will work out of the box; the flow coming from inputStream
will go as fast as the slowest branch of the fork. In other words, if one
destination pauses the source stream to handle backpressure for a long
time, all the other destinations will be waiting as well. Also, one destination
blocking indefinitely will block the entire pipeline!

• If we pipe to an additional stream after we've started consuming the data at
source (async piping), the new stream will only receive new chunks of data.
In those cases, we can use a PassThrough instance as a placeholder to collect
all the data from the moment we start consuming the stream. Then, the
PassThrough stream can be read at any future time without the risk of losing
any data. Just be aware that this approach might generate backpressure and
block the entire pipeline, as discussed in the previous point.
*/
