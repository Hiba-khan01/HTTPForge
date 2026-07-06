import { promises as fs } from "fs";
import * as path from "path";

import { HTTPRes } from "./http";
import { readerFromFile } from "./body";
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

    // Directory index
    if (reqPath.endsWith("/")) {
        reqPath += "index.html";
    }

    const filePath = path.normalize(
        path.join(PUBLIC_DIR, reqPath)
    );

    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        return null;
    }

    try {

        const stat = await fs.stat(filePath);

        if (!stat.isFile()) {
            return null;
        }

        return {
            code: 200,
            headers: [
                Buffer.from("Server: HTTPForge"),
                Buffer.from(
                    `Content-Type: ${getMimeType(filePath)}`
                ),
            ],
            body: await readerFromFile(filePath),
        };

    } catch {
        return null;
    }
}