import { parseArgs } from "@std/cli/parse-args";
import { listVueFiles } from "./src/analyze.ts";

const main = () => {
  const args = parseArgs(Deno.args);
  const directory = args._.length == 0 ? "." : String(args._[0]);
  listVueFiles(directory);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
