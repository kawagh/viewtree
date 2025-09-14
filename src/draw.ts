import { ImportInfo } from "./types.ts";

export type DOTOption = { title?: string };

export const makeDOTGraphString = (
  infoList: ImportInfo[],
  { title = "ComponentDependency" }: DOTOption,
): string => {
  let result = `digraph ${title} {\n`;
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
    result += `    "${from}" --> "${to}"\n`;
  }
  return result;
};
