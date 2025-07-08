import { Transform } from "stream";
export class ParallelStream extends Transform {
  constructor(userTransform, opts) {
    // (1)
    super({ objectMode: true, ...opts });
    this.userTransform = userTransform;
    this.running = 0;
    this.terminateCb = null;
  }

  _transform(chunk, enc, done) {
    // (2)
    this.running++;
    this.userTransform(
      chunk,
      enc,
      this.push.bind(this),
      this._onComplete.bind(this)
    );
    done();
  }

  _flush(done) {
    // (3)
    if (this.running > 0) {
      this.terminateCb = done;
    } else {
      done();
    }
  }

  _onComplete(err) {
    // (4)
    this.running--;
    if (err) {
      return this.emit("error", err);
    }
    if (this.running === 0) {
      this.terminateCb && this.terminateCb();
    }
  }
}

/**
 * 1. As you can see, the constructor accepts a userTransform() function, which is
then saved as an instance variable. We invoke the parent constructor and for
convenience, we enable the object mode by default.

2. Next, it is the _transform() method's turn. In this method, we execute the
userTransform() function and then increment the count of running tasks.
Finally, we notify the Transform stream that the current transformation
step is complete by invoking done(). The trick for triggering the processing
of another item in parallel is exactly this. We are not waiting for the
userTransform() function to complete before invoking done(); instead,
we do it immediately. On the other hand, we provide a special callback to
userTransform(), which is the this._onComplete() method. This allows us to
get notified when the execution of userTransform() completes.

3. The _flush() method is invoked just before the stream terminates, so if there
are still tasks running, we can put the release of the finish event on hold by
not invoking the done() callback immediately. Instead, we assign it to the
this.terminateCallback variable.

4. To understand how the stream is then properly terminated, we have to look
into the _onComplete() method. This last method is invoked every time an
asynchronous task completes. It checks whether there are any more tasks
running and, if there are none, it invokes the this.terminateCallback()
function, which will cause the stream to end, releasing the finish event that
was put on hold in the _flush() method.
 */
