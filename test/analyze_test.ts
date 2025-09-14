import { assertArrayIncludes, assertEquals } from "@std/assert";
import {
  extractComponentName,
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
