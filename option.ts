/// <reference types="npm:@types/node" />
import { parseArgs, ParseArgsConfig } from "node:util";
import deno from "./deno.json" with { type: "json" };

export type GlobalOption = {
    dryrun: boolean;
    dirs: string[];
};

export function showHelp(): void {
    console.log(`
${deno.cli} [${deno.version}]
Usage:
  ${deno.cli} [options] [dirs...]

Options:
      --dryrun          dry-run mode
  -h, --help            show command help
    `.trim());
}

export function parseOption(args: string[]): GlobalOption | null {
    const options: ParseArgsConfig["options"] = {
        dryrun: { type: "boolean" },
        help: { type: "boolean", short: "h" },
    };

    const { values, positionals } = parseArgs({
        args,
        options,
        allowPositionals: true,
    });

    const opt: GlobalOption = {
        dryrun: values["dryrun"] as boolean,
        dirs: positionals,
    };
    if (opt.dirs.length === 0) {
        opt.dirs = ["."];
    }

    if (values["help"] as boolean) {
        showHelp();
        return null;
    }

    return opt;
}
