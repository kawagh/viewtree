import { walk } from "@std/fs/walk";

export const listVueFiles = async (directory: string): Promise<void> => {
  for await (const entry of walk(directory)) {
    if (entry.name.endsWith(".vue")) {
      console.log("path", entry.path);
      console.log("name", entry.name);
    }
  }
};
