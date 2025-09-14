import { ImportInfo } from "./types.ts";

export type DOTOption = { title?: string };

export const makeDOTGraphString = (
  infoList: ImportInfo[],
  { title = "ComponentDependency" }: DOTOption,
): string => {
  let result = `digraph graph_identifier {\n`;
  // add attributes
  // ref: https://graphviz.org/doc/info/attrs.html
  result += "graph [\n";
  result += `  label = "${title}"\n`;
  result += `  labelloc = "t"\n`;
  result += "]\n";

  for (const { from, to } of infoList) {
    result += `  "${from}" -> "${to}";\n`;
  }

  result += "}\n";
  return result;
};

export const makeMermaidGraphString = (
  infoList: ImportInfo[],
  { title = "ComponentDependency" }: DOTOption,
): string => {
  const header = `
  ---
  title: ${title}
  ---
  `;
  let result = header + "graph TD\n";
  for (const { from, to } of infoList) {
    result += `    ${from} --> ${to}\n`;
  }
  return result;
};
