import { parseArgs } from "@std/cli/parse-args";
import {
  buildAdjacencyList,
  getInverseEdges,
  listEdgeFromRoot,
  listVueComponentDependencies,
} from "./src/analyze.ts";
import { makeDOTGraphString, makeMermaidGraphString } from "./src/draw.ts";
import { ImportInfo } from "./src/types.ts";

const VERSION = "0.4.0";

const HELP = `
Usage: viewtree [options]

options:
  -h --help                     show help
  -v --version                  show version
  -f --format <GraphFormat>     graph format [dot(default), mermaid]
  -r --root <RootComponentName> specify root component to show subgraph
  -i --inverse                  show inversed dependency (use with -r option)

example:
  viewtree <vue-project-path>  # show detected component dependencies
  viewtree                     # same as "viewtree ."
  viewtree -r SpecificView     # show dependencies of SpecificView.vue
`;

const main = async () => {
  const args = parseArgs(Deno.args, {
    string: ["format", "root"],
    boolean: ["inverse", "help", "version"],
    alias: {
      f: "format",
      h: "help",
      i: "inverse",
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
  if (args.inverse && !args.root) {
    console.error("--inverse option shoulde be used with --root option");
    Deno.exit(1);
  }
  const directory = args._.length == 0 ? "." : String(args._[0]);
  const edges = await listVueComponentDependencies(directory);

  if (edges.length == 0) {
    console.log(`Vue component dependency is not found : in ${directory}`);
    Deno.exit(1);
  }

  if (args.root) {
    const reverseEdges = getInverseEdges(edges);
    const adjList = buildAdjacencyList(args.inverse ? reverseEdges : edges);
    const subEdges = listEdgeFromRoot(args.root, adjList);

    if (subEdges.length == 0) {
      console.log(
        `Vue component dependency is not found : in ${directory}; root: ${args.root}`,
      );
      Deno.exit(1);
    }

    let title = `ComponentDependency root:${args.root}`;
    if (args.inverse) {
      title += "(inversed)";
    }
    outputString(
      subEdges,
      args.format,
      title,
      args.inverse,
    );
    Deno.exit(0);
  }

  outputString(edges, args.format);
};

const outputString = (
  edges: ImportInfo[],
  format?: string,
  title?: string,
  reverse: boolean = false,
) => {
  const str = (() => {
    const targetEdges = reverse ? getInverseEdges(edges) : edges;
    switch (format) {
      case "dot":
        return makeDOTGraphString(targetEdges, { title: title });
      case "mermaid":
        return makeMermaidGraphString(targetEdges, { title: title });
      default:
        if (format) {
          console.error(`unsupported format: ${format}`);
          Deno.exit(1);
        }
        return makeDOTGraphString(targetEdges, { title: title });
    }
  })();
  console.log(str);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
