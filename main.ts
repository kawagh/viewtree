import { parseArgs } from "@std/cli/parse-args";
import {
  buildAdjacencyList,
  listEdgeFromRoot,
  listVueComponentDependencies,
} from "./src/analyze.ts";
import { makeDOTGraphString, makeMermaidGraphString } from "./src/draw.ts";
import { ImportInfo } from "./src/types.ts";

const VERSION = "0.3.0";

const HELP = `
Usage: viewtree [options]

options:
  -h --help                     show help
  -v --version                  show version
  -f --format <GraphFormat>     graph format [dot(default), mermaid]
  -r --root <RootComponentName> specify root component to show subgraph

example:
  viewtree <vue-project-path>  # show detected component dependencies
  viewtree                     # same as "viewtree ."
  viewtree -r SpecificView     # show dependencies of SpecificView.vue
`;

const main = async () => {
  const args = parseArgs(Deno.args, {
    string: ["format", "root"],
    boolean: ["help", "version"],
    alias: {
      f: "format",
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
      console.log(
        `Vue component dependency is not found : in ${directory}; root: ${args.root}`,
      );
      Deno.exit(1);
    }

    outputString(
      subEdges,
      args.format,
      `ComponentDependency root:${args.root}`,
    );
    Deno.exit(0);
  }

  outputString(edges, args.format);
};

const outputString = (edges: ImportInfo[], format?: string, title?: string) => {
  const str = (() => {
    switch (format) {
      case "dot":
        return makeDOTGraphString(edges, { title: title });
      case "mermaid":
        return makeMermaidGraphString(edges, { title: title });
      default:
        if (format) {
          console.error(`unsupported format: ${format}`);
          Deno.exit(1);
        }
        return makeDOTGraphString(edges, {title: title});
    }
  })();
  console.log(str);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
