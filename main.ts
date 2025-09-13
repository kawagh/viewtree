import { parseArgs } from "@std/cli/parse-args";
import {
  buildAdjacencyList,
  listEdgeFromRoot,
  listVueComponentDependencies,
} from "./src/analyze.ts";
import { makeDOTGraphString } from "./src/draw.ts";

const VERSION = "0.2.0";

const HELP = `
Usage: viewtree [options]

options:
  -h --help                     show help
  -v --version                  show version
  -r --root <RootComponentName> specify root component to show subgraph

example:
  viewtree <vue-project-path>  # show detected component dependencies
  viewtree                     # same as "viewtree ."
  viewtree -r SpecificView     # show dependencies of SpecificView.vue
`;

const main = async () => {
  const args = parseArgs(Deno.args, {
    string: ["root"],
    boolean: ["help", "version"],
    alias: {
      h: "help",
      r: "root",
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

  if (args.root) {
    const adjList = buildAdjacencyList(edges);
    const subEdges = listEdgeFromRoot(args.root, adjList);

    if (subEdges.length == 0) {
      console.log(`Vue component dependency is not found : in ${directory}; root: ${args.root}`);
      Deno.exit(1);
    }

    const str = makeDOTGraphString(subEdges, {
      title: `"ComponentDependency root:${args.root}"`,
    });
    console.log(str);
    Deno.exit(0);
  }

  const str = makeDOTGraphString(edges, {});
  console.log(str);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
