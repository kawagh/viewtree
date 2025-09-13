import { parseArgs } from "@std/cli/parse-args";
import { listVueComponentDependencies } from "./src/analyze.ts";
import { makeDOTGraphString } from "./src/draw.ts";

const VERSION = "0.1.0";

const main = async () => {
  const args = parseArgs(Deno.args, {
    boolean: ["version"],
    alias: {
      v: "version",
    }
  });
  if(args.version) {
    console.log(VERSION);
    Deno.exit(0);
  }
  const directory = args._.length == 0 ? "." : String(args._[0]);
  const edges = await listVueComponentDependencies(directory);
  const str = makeDOTGraphString(edges, {});
  console.log(str);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
