// @deno-types='npm:@types/encoding-japanese'
import Encoding from "npm:encoding-japanese";
import { walk } from "https://deno.land/std/fs/walk.ts";
import { GlobalOption } from "./option.ts";

async function* getFiles(dir: string) {
    for await (const file of walk(dir, { maxDepth: 1 })) {
        if (file.isFile) {
            yield file.name;
        }
    }
}

function nfd2nfc(str: string): string {
    return str.normalize("NFC");
}

function removeIncompatibleChar(str: string): string {
    const bin = Encoding.convert(Encoding.stringToCode(str), {
        to: "SJIS",
        from: "UNICODE",
        fallback: "ignore",
    });
    const u8 = Encoding.codeToString(Encoding.convert(bin, {
        to: "UNICODE",
        from: "SJIS",
    }));
    return u8;
}

export async function execute(dir: string, opt: GlobalOption) {
    for await (const file of getFiles(dir)) {
        const file_nfc = nfd2nfc(file);
        const file_u8 = removeIncompatibleChar(file_nfc);

        if (file != file_u8) {
            console.log(`detect:\n  ${file}\n  ${file_u8}`);

            if (!opt.dryrun) {
                const src = `${dir}/${file}`;
                const dst = `${dir}/${file_u8}`;
                await Deno.rename(src, dst);
            }
        }
    }
}
