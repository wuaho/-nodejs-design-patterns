import { Transform } from "stream";

export class FilterByBorough extends Transform {
  constructor(borough, options = {}) {
    options.objectMode = true;
    super(options);
    this.borough = borough;
  }

  _transform(record, enc, cb) {
    if (record.borough === this.borough) {
      this.push(record);
    }
    cb();
  }
}
