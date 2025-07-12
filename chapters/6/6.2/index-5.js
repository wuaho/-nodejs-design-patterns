// Answer to the question: What is the least common crime?

import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { TopRepeatedValue } from "./top-repeated-value.js";

const csvParser = parse({ columns: true });

createReadStream("london_crime_by_lsoa.csv")
  .pipe(csvParser)
  .pipe(new TopRepeatedValue("major_category", true))
  .pipe(process.stdout);
