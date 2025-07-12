// Answer to the question: What are the least dangerous areas of London?

import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { LeastCrimesPerArea } from "./least-crimes-per-area.js";

const csvParser = parse({ columns: true });

createReadStream("london_crime_by_lsoa.csv")
  .pipe(csvParser)
  .pipe(new LeastCrimesPerArea())
  .pipe(process.stdout);
