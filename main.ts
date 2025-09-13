import { parseArgs } from "@std/cli/parse-args";
import { listVueComponentDependencies } from "./src/analyze.ts";

const main = async () => {
  const args = parseArgs(Deno.args);
  const directory = args._.length == 0 ? "." : String(args._[0]);
  const edges = await listVueComponentDependencies(directory);
  console.log(edges);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
