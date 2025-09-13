import { parseArgs } from "@std/cli/parse-args";
import { listVueComponentDependencies } from "./src/analyze.ts";
import { makeDOTGraphString } from "./src/draw.ts";

const VERSION = "0.1.0";

const HELP = `
Usage: viewtree [options]

options:
  -h --help        show help
  -v --version     show version

example:
  viewtree <vue-project-path>  # show detected component dependencies
  viewtree                     # same as "viewtree ."
`;

const main = async () => {
  const args = parseArgs(Deno.args, {
    boolean: ["help", "version"],
    alias: {
      h: "help",
      v: "version",
    },
  });
  if (args.help) {
    console.log(HELP);
    Deno.exit(0);
  }
  if (args.version) {
    console.log(VERSION);
    Deno.exit(0);
  }
  const directory = args._.length == 0 ? "." : String(args._[0]);
  const edges = await listVueComponentDependencies(directory);

  if (edges.length == 0) {
    console.log(`Vue component dependency is not found : in ${directory}`);
    Deno.exit(1);
  }

  const str = makeDOTGraphString(edges, {});
  console.log(str);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
