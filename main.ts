import { parseArgs } from "@std/cli/parse-args";

export function add(a: number, b: number): number {
  return a + b;
}

const main = () => {
  const args = parseArgs(Deno.args);
  if (args._.length != 2) {
    console.error("引数は2つ指定してください");
    Deno.exit(1);
  }
  const n1 = Number(args._[0]);
  const n2 = Number(args._[1]);
  console.log(args);
  console.log(`Add ${n1} + ${n2} = ${add(n1, n2)}`);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
