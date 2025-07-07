import { concatFiles } from "./index.js";

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Uso: node index-cli.js <src1> <src2> ... <dest>");
  process.exit(1);
}

const dest = args[args.length - 1];
const srcFiles = args.slice(0, -1);

concatFiles(...srcFiles, dest, (err) => {
  if (err) {
    console.log("Error:", err.message);
    process.exit(1);
  }

  console.log("Archivos concatenados con éxito");
});
