import { assertEquals } from "@std/assert/equals";
import { extractComponentName } from "../src/analyze.ts";

Deno.test("extractComponentName", () => {
  assertEquals(extractComponentName("@/components/Header.vue"), "Header");
});
