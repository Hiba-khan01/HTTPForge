import { promises as fs } from "fs";
import * as path from "path";
import { HTTPRes } from "./http";
import { readerFromMemory } from "./body";
import { getMimeType } from "./mime";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Serve a static file
export async function serveStatic(
    uri: Buffer
): Promise<HTTPRes | null> {

    let reqPath = uri.toString("latin1");

    // Default route
    if (reqPath === "/") {
        reqPath = "/index.html";
    }

    // Prevent directory traversal attacks
    const filePath = path.normalize(
        path.join(PUBLIC_DIR, reqPath)
    );

    if (!filePath.startsWith(PUBLIC_DIR)) {
        return null;
    }

    try {
        const data = await fs.readFile(filePath);

        return {
            code: 200,
            headers: [
                Buffer.from("Server: HTTPForge"),
                Buffer.from(
                    `Content-Type: ${getMimeType(filePath)}`
                ),
            ],
            body: readerFromMemory(data),
        };
    } catch {
        return null;
    }
}