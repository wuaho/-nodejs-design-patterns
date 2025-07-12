// Answer to the question: What are the most dangerous areas of London?

import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { MostCrimesPerArea } from "./most-crimes-per-area.js";

const csvParser = parse({ columns: true });

createReadStream("london_crime_by_lsoa.csv")
  .pipe(csvParser)
  .pipe(new MostCrimesPerArea())
  .pipe(process.stdout);
