import { Transform } from "stream";

export class LeastCrimesPerArea extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.counts = new Map();
  }

  _transform(record, enc, cb) {
    if (this.counts.has(record.borough)) {
      this.counts.set(
        record.borough,
        this.counts.get(record.borough) + Number.parseInt(record.value)
      );
    } else {
      this.counts.set(record.borough, Number.parseInt(record.value));
    }
    cb();
  }

  _flush(cb) {
    const leastDangerousCities = [...this.counts.entries()]
      .sort((a, b) => a[1] - b[1])
      .slice(0, 10);

    this.push(
      "Top 10 least dangerous zones in London with their total number of crimes from 2008 to 2016:\n\n"
    );

    leastDangerousCities.forEach(([area, total], i) => {
      this.push(`${i + 1}.${area}: ${total.toLocaleString()} crimes\n`);
    });

    cb();
  }
}
