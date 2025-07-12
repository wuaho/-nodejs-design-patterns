import { Transform } from "stream";

export class SumCrimes extends Transform {
  constructor(year, options = {}) {
    options.objectMode = true;
    super(options);
    this.total = 0;
    this.year = year;
  }

  _transform(record, enc, cb) {
    this.total += Number.parseInt(record.value);
    cb();
  }

  _flush(cb) {
    this.push(`${this.year}: ${this.total.toLocaleString()}\n`);
    cb();
  }
}
