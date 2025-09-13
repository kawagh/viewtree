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
