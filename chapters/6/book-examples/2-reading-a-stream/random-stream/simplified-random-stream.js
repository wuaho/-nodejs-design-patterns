/**For simple custom streams, we can avoid creating a custom class by using the
Readable stream's simplified construction approach. With this approach, we only
need to invoke new Readable(options) and pass a method named read() in the set
of options. The read() method here has exactly the same semantic as the _read()
method that we saw in the class extension approach.

This approach can be particularly useful when you don't need to manage a
complicated state and allows you to take advantage of a more succinct syntax. In the
previous example, we created a single instance of our custom stream. If we want to
adopt the simplified constructor approach but we need to create multiple instances
of the custom stream, we can wrap the initialization logic in a factory function that
we can invoke multiple times to create those instances.
*/

import { Readable } from "stream";
import Chance from "chance";
const chance = new Chance();
let emittedBytes = 0;
const randomStream = new Readable({
  read(size) {
    const chunk = chance.string({ length: size });
    this.push(chunk, "utf8");
    emittedBytes += chunk.length;
    if (chance.bool({ likelihood: 5 })) {
      this.push(null);
    }
  },
});

// now use randomStream instance directly ...
