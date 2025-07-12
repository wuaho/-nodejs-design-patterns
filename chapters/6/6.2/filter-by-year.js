import { Transform } from "stream";

export class FilterByYear extends Transform {
  constructor(year, options = {}) {
    options.objectMode = true;
    super(options);
    this.year = year;
  }

  _transform(record, enc, cb) {
    if (record.year === this.year) {
      this.push(record);
    }
    cb();
  }
}
