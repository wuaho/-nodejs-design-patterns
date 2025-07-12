/* 6.2 Stream data processing: On Kaggle, you can find a lot of interesting data
sets, such as the London Crime Data (nodejsdp.link/london-crime). You can
download the data in CSV format and build a stream processing script that
analyzes the data and tries to answer the following questions:
• Did the number of crimes go up or down over the years?
• What are the most dangerous areas of London?
• What is the most common crime per area?
• What is the least common crime?
Hint: You can use a combination of Transform streams and PassThrough
streams to parse and observe the data as it is flowing. Then, you can build i nmemory aggregations for the data, which can help you answer the preceding
questions. Also, you don't need to do everything in one pipeline; you could
build very specialized pipelines (for example, one per question) and use the
fork pattern to distribute the parsed data across them.
*/

// Answer to the question: Did the number of crimes go up or down over the years?

import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { FilterByYear } from "./filter-by-year.js";
import { SumCrimes } from "./sum-crimes.js";

const csvParser = parse({ columns: true });

const years = [
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
];

const csvStream = createReadStream("london_crime_by_lsoa.csv").pipe(csvParser);

console.log("Crimes in London per year:");

years.forEach((year) => {
  csvStream
    .pipe(new FilterByYear(year))
    .pipe(new SumCrimes(year))
    .pipe(process.stdout);
});
