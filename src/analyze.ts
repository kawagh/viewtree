import { walk } from "@std/fs/walk";
import { ImportInfo } from "./types.ts";

export const listVueFiles = async (directory: string): Promise<void> => {
  for await (const entry of walk(directory)) {
    if (entry.name.endsWith(".vue")) {
      console.log("path", entry.path);
      console.log("name", entry.name);
    }
  }
};

export const listVueComponentDependencies = async (
  directory: string,
): Promise<ImportInfo[]> => {
  const edges: ImportInfo[] = [];
  for await (const entry of walk(directory)) {
    if (entry.name.endsWith(".vue")) {
      const fileContent = await Deno.readTextFile(entry.path);
      for (const line of fileContent.split("\n")) {
        const importInfo = extractImportInfoFromLine(entry.path, line);
        if (importInfo != null) {
          edges.push(importInfo);
        }
      }
    }
  }
  return edges;
};

/**
 * 有向辺のリストから隣接リストを作成する
 */
export const buildAdjacencyList = (
  infoList: ImportInfo[],
): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  for (const { from, to } of infoList) {
    const exist = map.get(from) || [];
    exist.push(to);
    map.set(from, exist);
  }
  return map;
};

/**
 * 隣接リストから指定したノードを親として有向辺を列挙する
 */
export const listEdgeFromRoot = (
  root: string,
  adjacencyList: Map<string, string[]>,
): ImportInfo[] => {
  const edges: ImportInfo[] = [];
  const visited = new Set<string>();

  const traverse = (currentNode: string) => {
    if (visited.has(currentNode)) {
      return;
    }
    visited.add(currentNode);

    const children = adjacencyList.get(currentNode) || [];
    for (const child of children) {
      edges.push({ from: currentNode, to: child });
      traverse(child);
    }
  };
  traverse(root);
  return edges;
};

const extractImportInfoFromLine = (
  filePath: string,
  line: string,
): ImportInfo | null => {
  if (!line.startsWith("import")) return null;
  if (!line.endsWith(".vue'") && !line.endsWith(".vue';")) return null;
  const tokens = line.split(" ");
  const tailToken = tokens[tokens.length - 1];
  // NOTE: ディレクトリの異なる同名のコンポーネントを区別出来るようにする
  const toCompnentName = extractComponentName(tailToken);
  const fromComponentName = extractComponentName(filePath);

  return { from: fromComponentName, to: toCompnentName };
};

export const extractComponentName = (path: string): string => {
  const componentName =
    path.split("/")[path.split("/").length - 1].split(".")[0];
  return componentName;
};

export const getInverseEdges = (edges: ImportInfo[]): ImportInfo[] => {
  return edges.map((it) => {
    return { from: it.to, to: it.from };
  });
};
