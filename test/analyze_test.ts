import { assertArrayIncludes, assertEquals } from "@std/assert";
import {
  buildAdjacencyList,
  extractComponentName,
  listEdgeFromRoot,
  listVueComponentDependencies,
} from "../src/analyze.ts";
import { ImportInfo } from "../src/types.ts";

Deno.test("extractComponentName", () => {
  assertEquals(extractComponentName("@/components/Header.vue"), "Header");
});
Deno.test({
  name: "listVueComponentDependencies",
  fn: async (t) => {
    await t.step({
      name: "コンポーネントの依存関係が全て検出されていること",
      async fn() {
        const result = await listVueComponentDependencies("./test/resource");
        const expected: ImportInfo[] = [
          { from: "ListView", to: "Header" },
          { from: "ListView", to: "Footer" },
          { from: "ListView", to: "Table" },
          { from: "Table", to: "TableRow" },
          { from: "Table", to: "TableHeader" },
        ];
        assertArrayIncludes(result, expected);
        assertEquals(result.length, expected.length);
      },
    });
  },
});

Deno.test("buildAdjacencyList", () => {
  const edges: ImportInfo[] = [
    { from: "ListView", to: "Header" },
    { from: "ListView", to: "Footer" },
    { from: "ListView", to: "Table" },
    { from: "Table", to: "TableRow" },
    { from: "Table", to: "TableHeader" },
  ];

  const result = buildAdjacencyList(edges);

  assertEquals(result.get("ListView"), ["Header", "Footer", "Table"]);
  assertEquals(result.get("Table"), ["TableRow", "TableHeader"]);
  assertEquals(result.get("NonExistent"), undefined);
});

Deno.test("listEdgeFromRoot", () => {
  const adjacencyList = new Map<string, string[]>();
  adjacencyList.set("ListView", ["Header", "Footer", "Table"]);
  adjacencyList.set("Table", ["TableRow", "TableHeader"]);

  const result = listEdgeFromRoot("Table", adjacencyList);

  const expected: ImportInfo[] = [
    { from: "Table", to: "TableRow" },
    { from: "Table", to: "TableHeader" },
  ];

  assertArrayIncludes(result, expected);
  assertEquals(result.length, expected.length);
});
