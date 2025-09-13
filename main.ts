import { parseArgs } from "@std/cli/parse-args";
import { listVueComponentDependencies } from "./src/analyze.ts";
import { makeDOTGraphString } from "./src/draw.ts";

const main = async () => {
  const args = parseArgs(Deno.args);
  const directory = args._.length == 0 ? "." : String(args._[0]);
  const edges = await listVueComponentDependencies(directory);
  const str = makeDOTGraphString(edges, {});
  console.log(str);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
