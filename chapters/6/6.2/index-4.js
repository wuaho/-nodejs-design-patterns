// Answer to the question: What is the most common crime per area?
// 1. Filter by the area we want to search
// 2. Look for the most common crime in that area

import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { FilterByBorough } from "./filter-by-borough.js";
import { TopRepeatedValue } from "./top-repeated-value.js";

const csvParser = parse({ columns: true });

createReadStream("london_crime_by_lsoa.csv")
  .pipe(csvParser)
  .pipe(new FilterByBorough("Croydon"))
  .pipe(new TopRepeatedValue("major_category"))
  .pipe(process.stdout);
