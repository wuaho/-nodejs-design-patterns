import { Transform } from "stream";

export class TopRepeatedValue extends Transform {
  constructor(field, reverse = false, options = {}) {
    options.objectMode = true;
    super(options);
    this.field = field;
    this.reverse = reverse;
    this.counts = new Map();
  }

  _transform(record, enc, cb) {
    if (this.counts.has(record[this.field])) {
      this.counts.set(
        record[this.field],
        this.counts.get(record[this.field]) + Number.parseInt(record.value)
      );
    } else {
      this.counts.set(record[this.field], Number.parseInt(record.value));
    }
    cb();
  }

  _flush(cb) {
    const topCities = [...this.counts.entries()]
      .sort((a, b) => (this.reverse ? a[1] - b[1] : b[1] - a[1]))
      .slice(0, 10);

    this.push(
      `Top 10 ${this.reverse ? "least" : "most"} common '${
        this.field
      }' for the crimes in London from 2008 to 2016:\n\n`
    );

    topCities.forEach(([field, total], i) => {
      this.push(`${i + 1}.${field}: ${total.toLocaleString()} crimes\n`);
    });

    cb();
  }
}
