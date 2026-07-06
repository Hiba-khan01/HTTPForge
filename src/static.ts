import { promises as fs } from "fs";
import * as path from "path";

import { HTTPRes } from "./http";
import { readerFromFile } from "./body";
import { getMimeType } from "./mime";
import { serveDirectory } from "./directory";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Serve a static file or directory
export async function serveStatic(
    uri: Buffer
): Promise<HTTPRes | null> {

    let reqPath = uri.toString("latin1");

    if (reqPath === "") {
        reqPath = "/";
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

        // -----------------------------
        // Directory
        // -----------------------------
        if (stat.isDirectory()) {

            const indexFile = path.join(
                filePath,
                "index.html"
            );

            try {

                const indexStat = await fs.stat(indexFile);

                if (indexStat.isFile()) {

                    return {
                        code: 200,
                        headers: [
                            Buffer.from("Server: HTTPForge"),
                            Buffer.from(
                                `Content-Type: ${getMimeType(indexFile)}`
                            ),
                        ],
                        body: await readerFromFile(indexFile),
                    };
                }

            } catch {
                // No index.html
            }

            return await serveDirectory(
                filePath,
                reqPath.endsWith("/")
                    ? reqPath
                    : reqPath + "/"
            );
        }

        // -----------------------------
        // Regular File
        // -----------------------------
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