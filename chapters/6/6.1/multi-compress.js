import { basename } from "path";
import { createReadStream, createWriteStream, statSync } from "fs";
import { createBrotliCompress, createDeflate, createGzip } from "zlib";
import { PassThrough, pipeline } from "stream";
import { hrtime } from "process";

const startTimestamps = {
  brotli: 0,
  deflate: 0,
  gzip: 0,
};
const timeResults = {
  brotli: 0,
  deflate: 0,
  gzip: 0,
};

const sizes = {
  original: 0,
  brotli: 0,
  deflate: 0,
  gzip: 0,
};

const compressions = [
  { label: "brotli", compressor: createBrotliCompress(), extension: "br" },
  { label: "deflate", compressor: createDeflate(), extension: "zz" },
  { label: "gzip", compressor: createGzip(), extension: "gz" },
];

let streams = 3;

export async function multiCompress(filename) {
  const file = basename(filename);
  console.log(`File request received: ${file}`);
  sizes["original"] = statSync(filename).size;

  const inputStream = createReadStream(file);

  compressions.forEach(({ label, compressor, extension }) => {
    pipeline(
      inputStream,
      startTimer(label),
      compressor,
      endTimer(label),
      createMonitor(label),
      createWriteStream(`compressed-files/${file}.${extension}`),
      printResults
    );
  });
}

function printResults(err) {
  if (err) {
    console.error(`Pipeline failed`, err);
  }

  if (--streams === 0) {
    console.log(
      "╔════════════╦════════════════════╦════════════════╦════════════════════╗"
    );
    console.log(
      "║ Algoritmo  ║ Tiempo (ns)        ║ Ratio (%)      ║ Tamaño final (B)   ║"
    );
    console.log(
      "╠════════════╬════════════════════╬════════════════╬════════════════════╣"
    );

    compressions.forEach((compression) => {
      const label = compression.label;
      const time = timeResults[label].toString().padStart(18);
      const size = sizes[label];
      const ratio = ((size / sizes.original) * 100).toFixed(2).padStart(12);
      const finalSize = size.toString().padStart(18);

      console.log(
        `║ ${label.padEnd(10)} ║ ${time} ║ ${ratio}% ║ ${finalSize} ║`
      );
    });

    console.log(
      "╚════════════╩════════════════════╩════════════════╩════════════════════╝"
    );
  }
}

function createMonitor(label) {
  let bytesWritten = 0;
  const monitor = new PassThrough();

  monitor.on("data", (chunk) => {
    bytesWritten += chunk.length;
  });

  monitor.on("finish", () => {
    sizes[label] = bytesWritten;
  });

  return monitor;
}

function startTimer(label) {
  let startTimer = new PassThrough();
  startTimer.once("data", () => {
    startTimestamps[label] = hrtime.bigint();
  });
  return startTimer;
}

function endTimer(label) {
  let endTimer = new PassThrough();
  endTimer.once("end", () => {
    timeResults[label] = hrtime.bigint() - startTimestamps[label];
  });
  return endTimer;
}
