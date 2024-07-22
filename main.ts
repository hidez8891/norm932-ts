import { parseOption } from "./option.ts";
import { execute } from "./execute.ts";
import InputLoop from "https://deno.land/x/input/index.ts";

async function main() {
  const opt = parseOption(Deno.args);
  if (opt == null) {
    Deno.exit(1);
  }

  for (const dir of opt.dirs) {
    await execute(dir, opt);
  }

  const input = new InputLoop();
  await input.wait("Press any key to continue...", true);
}

await main();
