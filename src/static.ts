import { promises as fs } from "fs";
import * as path from "path";

import { HTTPReq, HTTPRes } from "./http";
import { readerFromFile } from "./body";
import { getMimeType } from "./mime";
import { serveDirectory } from "./directory";
import { parseRangeHeader } from "./utils";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Serve a static file or directory
export async function serveStatic(
    req: HTTPReq
): Promise<HTTPRes | null> {

    let reqPath = req.uri.toString("latin1");

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

                const indexStat =
                    await fs.stat(indexFile);

                if (indexStat.isFile()) {

                    return {
                        code: 200,
                        headers: [
                            Buffer.from("Server: HTTPForge"),
                            Buffer.from(
                                `Content-Type: ${getMimeType(indexFile)}`
                            ),
                            Buffer.from("Accept-Ranges: bytes"),
                        ],
                        body: await readerFromFile(indexFile),
                    };
                }

            } catch {
                // no index.html
            }

            return await serveDirectory(
                filePath,
                reqPath.endsWith("/")
                    ? reqPath
                    : reqPath + "/"
            );
        }

        // -----------------------------
        // Range Request
        // -----------------------------

        const range =
            parseRangeHeader(req.headers);

        if (range) {

            if (
                range.end >= stat.size
            ) {
                range.end = stat.size - 1;
            }

            return {
                code: 206,
                headers: [
                    Buffer.from("Server: HTTPForge"),
                    Buffer.from(
                        `Content-Type: ${getMimeType(filePath)}`
                    ),
                    Buffer.from("Accept-Ranges: bytes"),
                    Buffer.from(
                        `Content-Range: bytes ${range.start}-${range.end}/${stat.size}`
                    ),
                ],
                                body: await readerFromFile(
                    filePath,
                    {
                        start: range.start,
                        end: range.end,
                    }
                ),
            };
        }

        // -----------------------------
        // Normal File
        // -----------------------------

        return {
            code: 200,
            headers: [
                Buffer.from("Server: HTTPForge"),
                Buffer.from(
                    `Content-Type: ${getMimeType(filePath)}`
                ),
                Buffer.from("Accept-Ranges: bytes"),
            ],
            body: await readerFromFile(filePath),
        };

    } catch {
        return null;
    }
}