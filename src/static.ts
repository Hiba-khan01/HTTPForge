import { promises as fs } from "fs";
import * as path from "path";
import { BodyReader, HTTPRes } from "./http";
import { readerFromMemory } from "./body";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Serve a static file
export async function serveStatic(
    uri: Buffer
): Promise<HTTPRes | null> {

    let reqPath = uri.toString("latin1");

    if (reqPath === "/") {
        reqPath = "/index.html";
    }

    const filePath = path.join(PUBLIC_DIR, reqPath);

    try {
        const data = await fs.readFile(filePath);

        return {
            code: 200,
            headers: [
                Buffer.from("Server: HTTPForge"),
            ],
            body: readerFromMemory(data),
        };
    } catch {
        return null;
    }
}